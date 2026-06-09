import React, { useState, useRef, useEffect } from 'react';
import { Box, Card, CardContent, IconButton, Typography, Snackbar, Alert } from '@mui/material';
import { Trash2, Terminal as TerminalIcon, Folder } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ==========================================
// 🟢 IMPORT QISMI (Komponentlar va API sozlamalari)
// ==========================================
import api from '../config/api';
import { useAuth } from '../context/AuthContext';
import { UserProfileHeader } from '../components/UserProfileHeader';
import { TaskPanel } from '../components/TaskPanel';
import { NanoEditor } from '../components/NanoEditor';
import { TerminalConsole } from '../components/TerminalConsole';
import FileListVisualizer from '../components/FileListVisualizer';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ==========================================
  // 🟢 STATE-LAR (Holatlar boshqaruvi)
  // ==========================================
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('~');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // 🖥 Nano muharriri uchun kerakli statelar
  const [isNanoActive, setIsNanoActive] = useState(false); // Nano rejimi yoqilgan/o'chirilganligi
  const [nanoFileName, setNanoFileName] = useState('');     // Ochilgan fayl nomi
  const [nanoContent, setNanoContent] = useState('');       // Fayl ichidagi matn (Kontent)

  // 📋 Topshiriq va foydalanuvchi ma'lumotlari statelari
  const [activeTask, setActiveTask] = useState<any>(null);
  const [userStructure, setUserStructure] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // 🔔 Bildirishnomalar statelari (Toast Notification)
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // 🛰 Celery topishiriqlarini vizual kuzatish statelari
  const [taskProgress, setTaskProgress] = useState<{
    status: 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILURE';
    message: string;
  }>({ status: 'IDLE', message: 'Tizim tayyor. Buyruq kutilmoqda...' });

  // ==========================================
  // 🟢 REF-LAR (Fokus va Avto-scroll boshqaruvi)
  // ==========================================
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nanoTextAreaRef = useRef<HTMLTextAreaElement>(null);

  // 🎯 Fokusni boshqarish: Nano yoniqligiga qarab kerakli oynaga fokus beradi
  const focusInput = () => {
    if (!isNanoActive && inputRef.current) inputRef.current.focus();
    else if (isNanoActive && nanoTextAreaRef.current) nanoTextAreaRef.current.focus();
  };

  // ==========================================
  // 👤 PROFIL FUNKSIYALARI
  // ==========================================
  const handleUpdateProfile = async (
    updatedData: { first_name?: string; last_name?: string; email?: string; password?: string },
    isPartial: boolean = true
  ) => {
    try {
      const method = isPartial ? 'patch' : 'put';
      const response = await api[method]('api/profile1/', updatedData); 
      if (response.status === 200) {
        alert(`Profil ${isPartial ? "qisman (PATCH)" : "to'liq (PUT)"} muvaffaqiyatli yangilandi!`);
        fetchUserProfile();
      }
    } catch (error: any) {
      console.error(`Profilni yangilashda xatolik:`, error);
      const backendError = error.response?.data;
      if (backendError && typeof backendError === 'object') {
        const errorMessages = Object.entries(backendError)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('\n');
        alert(errorMessages);
      } else {
        alert(backendError?.detail || "Profilni yangilab bo'lmadi.");
      }
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await api.get('/api/profile/');
      if (Array.isArray(res.data) && res.data.length > 0) setProfile(res.data[0]);
    } catch (err) {
      console.error("Profil ma'lumotlarini yuklashda xatolik.");
    }
  };

  useEffect(() => { fetchUserProfile(); }, []);
  useEffect(() => { focusInput(); }, [isNanoActive, history]);

  // ==========================================
  // ⌨️ GNU NANO HOTKEY (Klaviatura tugmalari boshqaruvi)
  // ==========================================
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isNanoActive) {
        if (e.ctrlKey && e.key.toLowerCase() === 'o') {
          e.preventDefault();
          handleNanoSave();
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'x') {
          e.preventDefault();
          setIsNanoActive(false);
          setHistory(prev => [...prev, {
            command: `nano ${nanoFileName}`,
            output: 'GNU nano muharriridan chiqildi.',
            timestamp: new Date()
          }]);
          setNanoContent('');
          setNanoFileName('');
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, true);
  }, [isNanoActive, nanoFileName, nanoContent]);

  const handleNanoSave = async () => {
    if (!nanoFileName || loading) return;
    setLoading(true);
    try {
      const res = await api.post('/terminal/', {
        type: "nano_save",
        path: nanoFileName,
        content: nanoContent
      });
      if (res.data) {
        setSuccessMessage('Fayl muvaffaqiyatli saqlandi! 💾');
        setSuccess(true);
        if (res.data.structure) setUserStructure(res.data.structure);
      }
    } catch (err) {
      console.error("Saqlashda xato:", err);
      setError('Faylni saqlashda ichki xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 🔄 CELERY TASK HOLATINI TEKSHIRISH (POLLING)
  // ==========================================
  const checkTaskStatusWithPolling = (taskId: string, currentCommand: string) => {
    // 1. Tekshirish boshlanishi bilan holatni PENDING qilamiz
    setTaskProgress({ status: 'PENDING', message: 'Celery: Topshiriq tekshirilmoqda. Iltimos kuting...' });

    const intervalId = setInterval(async () => {
      try {
        const res = await api.get(`/api/task-status/${taskId}/`);
        const data = res.data;

        if (data.status === 'SUCCESS') {
          clearInterval(intervalId);
          setLoading(false);

          const outputText = data.result || 'Topshiriq muvaffaqiyatli tekshirildi.';
          setHistory((prev) => [...prev, { command: currentCommand, output: outputText, timestamp: new Date() }]);

          if (data.task_status === 'completed') {
            // ✅ Muvaffaqiyat holati ko'rsatiladi
            setTaskProgress({ status: 'SUCCESS', message: `Muvaffaqiyatli! +${data.xp || 10} XP qo'shildi.` });
            setSuccessMessage('Topshiriq muvaffaqiyatli bajarildi! 🎉');
            setSuccess(true);
            setActiveTask(null);
            setUserStructure(null);
            fetchUserProfile();
          } else {
            // ❌ Topshiriq shart bajarilmagan holat
            setTaskProgress({ status: 'FAILURE', message: 'Xato: Topshiriq talablari to\'liq bajarilmagan.' });
            setError("Topshiriq strukturasi noto'g'ri bajarilgan. Qaytadan urinib ko'ring! ❌");
          }
        } else if (data.status === 'FAILURE') {
          clearInterval(intervalId);
          setLoading(false);
          setTaskProgress({ status: 'FAILURE', message: 'Xatolik: Tekshirish tizimi to\'xtab qoldi.' });
          setHistory((prev) => [...prev, { command: currentCommand, output: "Xatolik: Tekshirish tizimida ichki xato yuz berdi.", timestamp: new Date() }]);
        }
      } catch (err) {
        console.error("Polling xatoligi:", err);
        clearInterval(intervalId);
        setLoading(false);
        setTaskProgress({ status: 'FAILURE', message: 'Aloqa xatosi: Server javob bermadi.' });
        setError("Topshiriq holatini yangilashda aloqa uzildi.");
      }
    }, 1500);
  };

  // ==========================================
  // 🚀 TERMINAL BUYRUQLARINI SUBMIT QILISH
  // ==========================================
  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || loading) return;

    const currentCommand = command.trim();
    setCommand('');
    setLoading(true);

    if (currentCommand.toLowerCase() === 'clear') {
      setHistory([]);
      setLoading(false);
      return;
    }

    if (currentCommand.startsWith('nano ')) {
      const fileName = currentCommand.split(/\s+/)[1] || 'unnamed.txt';
      setNanoFileName(fileName);
      try {
        const res = await api.post('/terminal/', {
          type: "regular_command",
          command: currentCommand
        });
        const responseData = res.data;
        let existingContent = '';
        if (responseData.result && responseData.result.content !== undefined) {
          existingContent = responseData.result.content;
        } else if (responseData.content !== undefined) {
          existingContent = responseData.content;
        }
        setNanoContent(existingContent);
        setIsNanoActive(true);

        if (responseData.current_path) setCurrentDirectory(responseData.current_path);
        if (responseData.structure) setUserStructure(responseData.structure);
      } catch (err) {
        console.error("Faylni yuklashda xato:", err);
        setHistory((prev) => [...prev, { command: currentCommand, output: "Faylni ochib bo'lmadi.", timestamp: new Date() }]);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const res = await api.post('/terminal/', {
        type: "regular_command",
        command: currentCommand
      });
      const responseData = res.data;

      if (responseData.current_path) setCurrentDirectory(responseData.current_path);
      if (responseData.structure) setUserStructure(responseData.structure);

      if (currentCommand.toLowerCase() === 'check' && responseData.type === 'check_queued') {
        const queueText = responseData.output || 'Topshiriq tekshirishga topshirildi... Natija yuklanmoqda.';
        setHistory((prev) => [...prev, { command: currentCommand, output: queueText, timestamp: new Date() }]);
        checkTaskStatusWithPolling(responseData.celery_task_id, currentCommand);
        return; 
      }

      const outputText = responseData.output || responseData.result?.output || 'Buyruq bajarildi.';
      setHistory((prev) => [...prev, { command: currentCommand, output: outputText, timestamp: new Date() }]);
      setLoading(false);
    } catch (err: any) {
      console.error("Buyruq xatosi:", err);
      const errText = err.response?.data?.detail || err.response?.data?.output || 'Xatolik: Buyruq ijrosida muammo.';
      setHistory((prev) => [...prev, { command: currentCommand, output: errText, timestamp: new Date() }]);
      setLoading(false);
    }
  };

  // ==========================================
  // 📋 YANGI TOPSHIRIQ OLISH
  // ==========================================
  const handleGetTask = async () => {
    setLoading(true);
    try {
      const res = await api.get('/task/');
      if (res.data) {
        setActiveTask(res.data);
        setUserStructure([]);
      }
    } catch (err) {
      setError("Yangi topshiriqni yuklab bo'lmadi.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/auth'); };

  const onUpdateProfile = async (updatedData: { username: string; email?: string }) => {
    try {
      const res = await api.patch('/api/profile1/', updatedData);
      if (res.data) {
        setSuccessMessage("Profil muvaffaqiyatli yangilandi! 🔄");
        setSuccess(true);
        fetchUserProfile();
      }
    } catch (err) {
      console.error("Yangilashda xato:", err);
      setError("Profilni yangilab bo'lmadi.");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Hisobingizni butunlay o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi!")) {
      try {
        const res = await api.delete('/api/profile1/');
        alert(res.data.detail || res.data.message);
        handleLogout();
      } catch (err) {
        setError("Hisobni o'chirishda xatolik yuz berdi.");
      }
    }
  };
// ==========================================
  // 🎨 VIZUAL INTERFEYS (UI Render)
  // ==========================================
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0A0A0A', overflow: 'hidden' }}>

      {/* 🔝 FOYDALANUVCHI PROFILI BAR (HEADER) */}
      <UserProfileHeader
        username={user?.username}
        profile={profile}
        onLogout={handleLogout}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* 🎯 Real vaqtda Celery va Oxirgi topshiriq holatini ko'rsatuvchi doimiy maydon */}
      <Box sx={{ 
        mx: 2, 
        mt: 1, 
        mb: 0, 
        p: 1.2, 
        bgcolor: '#121212', 
        border: '1px dashed rgba(57, 255, 20, 0.2)', 
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
      }}>
        {/* Pulsatsiya qiluvchi LED chiroq datchigi */}
        <Box sx={{ 
          width: 9, 
          height: 9, 
          borderRadius: '50%', 
          bgcolor: taskProgress?.status === 'PENDING' ? '#FFD700' : 
                   taskProgress?.status === 'SUCCESS' ? '#39FF14' : 
                   taskProgress?.status === 'FAILURE' ? '#FF4444' : '#444',
          boxShadow: taskProgress?.status === 'PENDING' ? '0 0 10px #FFD700' : 
                     taskProgress?.status === 'SUCCESS' ? '0 0 10px #39FF14' : 
                     taskProgress?.status === 'FAILURE' ? '0 0 10px #FF4444' : 'none',
          animation: taskProgress?.status === 'PENDING' ? 'ledPulse 1.2s infinite' : 'none',
          "@keyframes ledPulse": { "0%": { opacity: 0.4 }, "50%": { opacity: 1 }, "100%": { opacity: 0.4 } }
        }} />
        
        <Typography variant="body2" sx={{ 
          fontFamily: 'monospace', 
          color: taskProgress?.status === 'PENDING' ? '#FFD700' : 
                 taskProgress?.status === 'SUCCESS' ? '#39FF14' : 
                 taskProgress?.status === 'FAILURE' ? '#FF4444' : '#777',
          fontSize: '0.85rem',
          letterSpacing: 0.5,
          fontWeight: 500
        }}>
          {taskProgress?.message || 'Tizim tayyor. Tekshirish uchun terminalga "check" buyrug\'ini kiriting.'}
        </Typography>
      </Box>

      {/* 📊 ASOSIY ISHCHI PANELI */}
      <Box sx={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '42% 58%',
        gap: 2,
        p: 2,
        overflow: 'hidden',
        height: 'calc(100vh - 110px)'
      }}>

        {/* 📦 CHAP TEPADA: JORIY TOPSHIRIQ PANELI */}
        <TaskPanel
          activeTask={activeTask}
          onGetTask={handleGetTask}
        />

        {/* 📦 O'NG TEPADA: VIZUAL FAYLLAR IERARXIYASI */}
        <Card sx={{ bgcolor: '#121212', border: '1px solid rgba(57, 255, 20, 0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ bgcolor: '#1A1A1A', px: 2, py: 1, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Folder size={14} style={{ color: '#FFD700' }} />
            <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600, fontSize: '0.85rem' }}>Sandbox Fayllar Tizimi</Typography>
          </Box>
          <CardContent sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: '#0F0F0F' }}>
            <FileListVisualizer structure={userStructure} />
          </CardContent>
        </Card>

        {/* 📟 PASTI: TERMINAL VA NANO EDITOR OYNASI */}
        <Card sx={{
          gridColumn: '1 / -1',
          bgcolor: '#000',
          border: '1px solid rgba(57, 255, 20, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Terminal / Nano Sarlavhasi */}
          <Box sx={{ bgcolor: '#1A1A1A', px: 2, py: 0.8, borderBottom: '1px solid rgba(57, 255, 20, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TerminalIcon size={14} style={{ color: '#39FF14' }} />
              <Typography variant="caption" sx={{ color: '#B0B0B0', fontFamily: 'monospace', letterSpacing: 0.5 }}>
                {isNanoActive ? `GNU nano v5.0 — ${nanoFileName}` : `user@cloud-sandbox: ${currentDirectory}`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" onClick={() => setHistory([])} disabled={isNanoActive} title="Ekranni tozalash">
                <Trash2 size={14} style={{ color: isNanoActive ? '#333' : '#666' }} />
              </IconButton>
            </Box>
          </Box>

          {/* Dinamik Oyna Almashinuvi (Terminal yoki Nano) */}
          <Box onClick={focusInput} sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {isNanoActive ? (
              <NanoEditor
                fileName={nanoFileName}
                content={nanoContent}
                setContent={setNanoContent}
                textAreaRef={nanoTextAreaRef as any}
              />
            ) : (
              <TerminalConsole
                history={history}
                loading={loading}
                currentDirectory={currentDirectory}
                command={command}
                setCommand={setCommand}
                inputRef={inputRef}
                onSubmit={handleCommandSubmit}
                terminalEndRef={terminalEndRef}
              />
            )}
          </Box>
        </Card>
      </Box>

      {/* 🔔 STATUS NOTIFICATION (TOAST) TIZIMI */}
      <Box>
        <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)}>
          <Alert severity="success" sx={{ bgcolor: '#121212', color: '#39FF14', border: '1px solid #39FF14' }}>
            {successMessage}
          </Alert>
        </Snackbar>

        <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
          <Alert severity="error" sx={{ bgcolor: '#121212', color: '#FF4444', border: '1px solid #FF4444' }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>

    </Box>
  );
}