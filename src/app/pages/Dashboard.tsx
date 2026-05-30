// // import React, { useState, useRef, useEffect } from 'react';
// // import { useAuth } from '../context/AuthContext';
// // import { useNavigate } from 'react-router-dom';
// // import {
// //   Box,
// //   Paper,
// //   Button,
// //   Typography,
// //   Avatar,
// //   Menu,
// //   MenuItem,
// //   IconButton,
// //   LinearProgress,
// //   Card,
// //   CardContent,
// //   Snackbar,
// //   Alert,
// // } from '@mui/material';
// // import {
// //   Trash2,
// //   ChevronDown,
// //   Folder,
// //   File,
// //   Terminal as TerminalIcon,
// //   CheckCircle,
// //   Play,
// //   Save,
// //   X,
// // } from 'lucide-react';
// // import api from '../config/api';

// // interface CommandHistory {
// //   command: string;
// //   output: string;
// //   timestamp: Date;
// // }

// // interface ActiveTask {
// //   task_id: number;
// //   title: string;
// //   description: string;
// //   level: number;
// //   xp: number;
// //   status: string;
// //   structure: Record<string, any>; 
// //   formatted_structure: string;
// // }

// // interface UserProfile {
// //   level: number;
// //   xp: number;
// //   success_streak: number;
// //   failed_attempts: number;
// //   total_completed_tasks: number;
// // }

// // interface FileListVisualizerProps {
// //   structure: string[] | Record<string, any> | null;
// // }

// // // 📂 Fayllar ierarxiyasini chizuvchi komponent
// // const FileListVisualizer: React.FC<FileListVisualizerProps> = ({ structure }) => {
// //   if (!structure || (Array.isArray(structure) && structure.length === 0)) {
// //     return (
// //       <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic', textAlign: 'center', mt: 4, fontFamily: 'monospace' }}>
// //         Papka bo'sh. Terminalda buyruqlar yordamida fayl yarating...
// //       </Typography>
// //     );
// //   }

// //   if (Array.isArray(structure)) {
// //     return (
// //       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
// //         {structure.map((item, idx) => {
// //           const isFolder = !item.includes('.') && !item.includes('_txt') && !item.includes('_png');
// //           return (
// //             <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.2, pl: 1 }}>
// //               {isFolder ? (
// //                 <Folder size={16} style={{ color: '#FFD700', fill: '#FFD700', opacity: 0.8 }} />
// //               ) : (
// //                 <File size={16} style={{ color: '#A0A0A0' }} />
// //               )}
// //               <Typography variant="body2" sx={{ color: '#E0E0E0', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' }}>
// //                 {item}{isFolder ? '/' : ''}
// //               </Typography>
// //             </Box>
// //           );
// //         })}
// //       </Box>
// //     );
// //   }

// //   const renderNestedTree = (data: any, name?: string) => {
// //     if (typeof data === 'string') {
// //       return (
// //         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 2, py: 0.2 }}>
// //           <File size={14} style={{ color: '#A0A0A0' }} />
// //           <Typography variant="body2" sx={{ color: '#E0E0E0', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' }}>{data}</Typography>
// //         </Box>
// //       );
// //     }
// //     if (Array.isArray(data)) {
// //       return <>{data.map((item, idx) => <Box key={idx}>{renderNestedTree(item)}</Box>)}</>;
// //     }
// //     return (
// //       <Box sx={{ pl: name ? 2 : 0 }}>
// //         {name && (
// //           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.4 }}>
// //             <Folder size={16} style={{ color: '#FFD700', fill: '#FFD700', opacity: 0.8 }} />
// //             <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' }}>
// //               {name}/
// //             </Typography>
// //           </Box>
// //         )}
// //         <Box sx={{ borderLeft: name ? '1px dashed rgba(255,255,255,0.15)' : 'none', ml: name ? 1 : 0 }}>
// //           {Object.keys(data).map((key) => (
// //             <Box key={key}>{renderNestedTree(data[key], key)}</Box>
// //           ))}
// //         </Box>
// //       </Box>
// //     );
// //   };

// //   return <Box>{renderNestedTree(structure)}</Box>;
// // };

// // export default function Dashboard() {
// //   const { user, logout } = useAuth();
// //   const navigate = useNavigate();

// //   // Shon-sharaf va holat shtatlari
// //   const [command, setCommand] = useState('');
// //   const [history, setHistory] = useState<CommandHistory[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [currentDirectory, setCurrentDirectory] = useState('~'); 

// //   // Nano Editor sozlamalari
// //   const [isNanoActive, setIsNanoActive] = useState(false);
// //   const [nanoFileName, setNanoFileName] = useState('');
// //   const [nanoContent, setNanoContent] = useState('');

// //   // API ma'lumotlari
// //   const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);
// //   const [userStructure, setUserStructure] = useState<string[] | null>(null); 
// //   const [profile, setProfile] = useState<UserProfile | null>(null);

// //   // UI boshqaruvlari
// //   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
// //   const [success, setSuccess] = useState(false);
// //   const [successMessage, setSuccessMessage] = useState('');
// //   const [error, setError] = useState('');

// //   const terminalEndRef = useRef<HTMLDivElement>(null);
// //   const inputRef = useRef<HTMLInputElement>(null);
// //   const nanoTextAreaRef = useRef<HTMLTextAreaElement>(null);

// //   const focusInput = () => {
// //     if (!isNanoActive && inputRef.current) {
// //       inputRef.current.focus();
// //     } else if (isNanoActive && nanoTextAreaRef.current) {
// //       nanoTextAreaRef.current.focus();
// //     }
// //   };

// //   const fetchUserProfile = async () => {
// //     try {
// //       const res = await api.get('/api/profile/');
// //       if (Array.isArray(res.data) && res.data.length > 0) {
// //         setProfile(res.data[0]);
// //       }
// //     } catch (err) {
// //       console.error("Profilni yuklashda xatolik yuz berdi.");
// //     }
// //   };

// //   useEffect(() => {
// //     fetchUserProfile();
// //   }, []);

// //   useEffect(() => { 
// //     focusInput(); 
// //   }, [isNanoActive]);

// //   useEffect(() => {
// //     if (!isNanoActive) {
// //       terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //     }
// //     focusInput();
// //   }, [history]);

// //   // Nano Hotkeys (Ctrl + O saqlash, Ctrl + X chiqish)
// //   useEffect(() => {
// //     const handleGlobalKeyDown = (e: KeyboardEvent) => {
// //       if (isNanoActive) {
// //         if (e.ctrlKey && e.key.toLowerCase() === 'o') {
// //           e.preventDefault();
// //           handleNanoSave();
// //         }
// //         if (e.ctrlKey && e.key.toLowerCase() === 'x') {
// //           e.preventDefault();
// //           setIsNanoActive(false);
// //           setHistory(prev => [...prev, { command: `nano ${nanoFileName}`, output: 'GNU nano muharriri yopildi.', timestamp: new Date() }]);
// //         }
// //       }
// //     };
// //     window.addEventListener('keydown', handleGlobalKeyDown, true);
// //     return () => window.removeEventListener('keydown', handleGlobalKeyDown, true);
// //   }, [isNanoActive, nanoFileName, nanoContent]);

// //   const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
// //   const handleCloseMenu = () => setAnchorEl(null);
// //   const handleLogout = () => { logout(); navigate('/auth'); };

// //   const formatOutput = (data: any): string => {
// //     if (!data) return 'Buyruq bajarildi.';
// //     if (typeof data === 'string') return data;
// //     if (typeof data === 'object') {
// //       if (data.result && data.result.output) return data.result.output;
// //       return data.output || data.message || JSON.stringify(data, null, 2);
// //     }
// //     return String(data);
// //   };

// //   const handleNanoSave = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await api.post('/terminal/', {
// //         command: `nano ${nanoFileName}`,
// //         content: nanoContent
// //       });
// //       if (res.data.result && res.data.result.status) {
// //         setSuccessMessage(res.data.result.status);
// //         setSuccess(true);
// //         if (res.data.structure) {
// //           setUserStructure(res.data.structure);
// //         }
// //       }
// //     } catch (err: any) {
// //       setError('Faylni saqlashda xatolik yuz berdi.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleCommandSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!command.trim() || loading) return;

// //     const currentCommand = command.trim();
// //     setCommand('');
// //     setLoading(true);

// //     if (currentCommand.toLowerCase() === 'clear') {
// //       setHistory([]);
// //       setLoading(false);
// //       setTimeout(focusInput, 10);
// //       return;
// //     }

// //     if (currentCommand.startsWith('nano ')) {
// //       const fileName = currentCommand.split(/\s+/)[1] || 'unnamed.txt';
// //       setNanoFileName(fileName);
// //       try {
// //         const res = await api.post('/terminal/', { command: currentCommand });
// //         const nanoResult = res.data.result;
// //         if (nanoResult && nanoResult.content !== undefined) {
// //           setNanoContent(nanoResult.content);
// //         } else {
// //           setNanoContent('');
// //         }
// //         setIsNanoActive(true);
// //       } catch (err: any) {
// //         setHistory((prev) => [...prev, { command: currentCommand, output: "Faylni ochishda xatolik yuklandi.", timestamp: new Date() }]);
// //       } finally {
// //         setLoading(false);
// //       }
// //       return;
// //     }

// //     try {
// //       const res = await api.post('/terminal/', { command: currentCommand });
// //       const responseData = res.data;

// //       if (responseData.current_path) {
// //         setCurrentDirectory(responseData.current_path);
// //       }

// //       if (responseData.structure) {
// //         setUserStructure(responseData.structure);
// //       }

// //       if (currentCommand.toLowerCase() === 'check' && responseData.result?.status?.includes('correct')) {
// //         setSuccessMessage('Topshiriq muvaffaqiyatli bajarildi! 🎉');
// //         setSuccess(true);
// //         setActiveTask(null); 
// //         setUserStructure(null);
// //         fetchUserProfile(); 
// //       }

// //       setHistory((prev) => [
// //         ...prev,
// //         { command: currentCommand, output: formatOutput(responseData), timestamp: new Date() },
// //       ]);
// //     } catch (err: any) {
// //       setHistory((prev) => [
// //         ...prev,
// //         { command: currentCommand, output: formatOutput(err.response?.data || 'Xatolik yuz berdi.'), timestamp: new Date() },
// //       ]);
// //     } finally {
// //       setLoading(false);
// //       setTimeout(focusInput, 10);
// //     }
// //   };

// //   const handleGetTask = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await api.get('/task/');
// //       if (res.data) {
// //         setActiveTask({
// //           task_id: res.data.task_id, title: res.data.title, description: res.data.description,
// //           level: res.data.level, xp: res.data.xp, status: res.data.status,
// //           structure: res.data.structure, formatted_structure: res.data.formatted_structure,
// //         });
// //         setUserStructure([]); 
// //       }
// //     } catch (err) {
// //       setError("Yangi topshiriqni yuklab bo'lmadi.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const currentXpPercentage = profile ? Math.min((profile.xp / 100) * 100, 100) : 0;

// //   return (
// //     <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0A0A0A', overflow: 'hidden' }}>
      
// //       {/* 🟢 TOP NAVBAR */}
// //       <Paper elevation={0} sx={{ bgcolor: '#121212', borderBottom: '1px solid rgba(57, 255, 20, 0.2)', px: 3, py: 1.2, zIndex: 10 }}>
// //         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
// //           <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
// //             <Avatar sx={{ bgcolor: '#39FF14', color: '#121212', width: 38, height: 38, fontWeight: 700 }}>
// //               {user?.username ? user.username[0].toUpperCase() : 'U'}
// //             </Avatar>
// //             <Box>
// //               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
// //                 <Typography sx={{ color: '#FFF', fontWeight: 600, fontSize: '0.95rem' }}>{user?.username || 'Foydalanuvchi'}</Typography>
// //                 <Typography variant="caption" sx={{ bgcolor: 'rgba(57, 255, 20, 0.1)', color: '#39FF14', px: 1, py: 0.2, borderRadius: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>
// //                   LVL {profile?.level || 1}
// //                 </Typography>
// //               </Box>
// //               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 220, mt: 0.5 }}>
// //                 <LinearProgress variant="determinate" value={currentXpPercentage} sx={{ flex: 1, height: 4, bgcolor: '#2A2A2A', borderRadius: 2, '& .MuiLinearProgress-bar': { bgcolor: '#39FF14' } }} />
// //                 <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{profile?.xp || 0} / 100 XP</Typography>
// //               </Box>
// //             </Box>
// //           </Box>
          
// //           <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
// //             <Box sx={{ display: 'flex', gap: 2 }}>
// //               <Typography variant="caption" sx={{ color: '#B0B0B0' }}>Streak: <span style={{ color: '#39FF14', fontWeight: 'bold' }}>{profile?.success_streak || 0} 🔥</span></Typography>
// //               <Typography variant="caption" sx={{ color: '#B0B0B0' }}>Bitirildi: <span style={{ color: '#FFF', fontWeight: 'bold' }}>{profile?.total_completed_tasks || 0}</span></Typography>
// //             </Box>
// //             <IconButton onClick={handleMenu} sx={{ color: '#39FF14' }} title="Sozlamalar"><ChevronDown size={18} /></IconButton>
// //           </Box>
          
// //           <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
// //             <MenuItem onClick={handleLogout}>Chiqish</MenuItem>
// //           </Menu>
// //         </Box>
// //       </Paper>

// //       {/* 🟢 INTERFEYS MAKETI (42% TEPASI, 58% PASTKI TERMINAL - QISILISH MUAMMOSI YECHILDI) */}
// //       <Box sx={{ 
// //         flex: 1, 
// //         display: 'grid', 
// //         gridTemplateColumns: '1fr 1fr', 
// //         gridTemplateRows: '42% 58%', 
// //         gap: 2, 
// //         p: 2, 
// //         overflow: 'hidden',
// //         height: 'calc(100vh - 65px)' 
// //       }}>
        
// //         {/* 📦 CHAP TEPADA: TASK PANEL */}
// //         <Card sx={{ bgcolor: '#121212', border: '1px solid rgba(57, 255, 20, 0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
// //           <Box sx={{ bgcolor: '#1A1A1A', px: 2, py: 1, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
// //             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //               <CheckCircle size={14} style={{ color: '#39FF14' }} />
// //               <Typography variant="subtitle2" sx={{ color: '#39FF14', fontWeight: 600, fontSize: '0.85rem' }}>Joriy Topshiriq</Typography>
// //             </Box>
// //             {!activeTask && (
// //               <Button size="small" variant="outlined" onClick={handleGetTask} startIcon={<Play size={12} />} sx={{ color: '#39FF14', borderColor: '#39FF14', fontSize: '0.75rem', py: 0.2, '&:hover': { borderColor: '#2ECC11', bgcolor: 'rgba(57, 255, 20, 0.05)' } }}>
// //                 Topshiriq Olish
// //               </Button>
// //             )}
// //           </Box>
// //           <CardContent sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
// //             {activeTask ? (
// //               <>
// //                 <Typography variant="h6" sx={{ color: '#FFF', fontSize: '1rem', fontWeight: 600 }}>{activeTask.title}</Typography>
// //                 <Typography variant="body2" sx={{ color: '#B0B0B0', fontSize: '0.85rem', lineHeight: 1.5 }}>{activeTask.description}</Typography>
// //                 {activeTask.formatted_structure && (
// //                   <Box sx={{ mt: 'auto', bgcolor: '#000', p: 1, borderRadius: 1, border: '1px solid #2A2A2A' }}>
// //                     <Typography variant="caption" sx={{ color: '#FF8C00', fontWeight: 'bold', display: 'block', mb: 0.5 }}>Kutilayotgan ierarxiya:</Typography>
// //                     <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#00FF66', fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
// //                       {activeTask.formatted_structure}
// //                     </Typography>
// //                   </Box>
// //                 )}
// //               </>
// //             ) : (
// //               <Box sx={{ display: 'flex', flex1: 1, alignItems: 'center', justifyContent: 'center', height: '100%' }}>
// //                 <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>Sizda faol topshiriq yo'q. Tizimdan yangisini yuklab oling.</Typography>
// //               </Box>
// //             )}
// //           </CardContent>
// //         </Card>

// //         {/* 📦 O'NG TEPADA: VIZUAL STRUKTURA */}
// //         <Card sx={{ bgcolor: '#121212', border: '1px solid rgba(57, 255, 20, 0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
// //           <Box sx={{ bgcolor: '#1A1A1A', px: 2, py: 1, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 1 }}>
// //             <Folder size={14} style={{ color: '#FFD700' }} />
// //             <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600, fontSize: '0.85rem' }}>Sandbox Fayllar Tizimi</Typography>
// //           </Box>
// //           <CardContent sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: '#0F0F0F' }}>
// //             <FileListVisualizer structure={userStructure} />
// //           </CardContent>
// //         </Card>

// //         {/* 📟 PASTI: PROFESSIONAL TERMINAL OYNASI VA NANO EDITOR */}
// //         <Card sx={{ 
// //           gridColumn: '1 / -1', 
// //           bgcolor: '#000', 
// //           border: '1px solid rgba(57, 255, 20, 0.25)', 
// //           display: 'flex', 
// //           flexDirection: 'column', 
// //           overflow: 'hidden' 
// //         }}>
// //           {/* Terminal Header */}
// //           <Box sx={{ bgcolor: '#1A1A1A', px: 2, py: 0.8, borderBottom: '1px solid rgba(57, 255, 20, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
// //             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //               <TerminalIcon size={14} style={{ color: '#39FF14' }} />
// //               <Typography variant="caption" sx={{ color: '#B0B0B0', fontFamily: 'monospace', letterSpacing: 0.5 }}>
// //                 {isNanoActive ? `GNU nano v5.0 — ${nanoFileName}` : `ilyos@cloud-sandbox: ${currentDirectory}`}
// //               </Typography>
// //             </Box>
// //             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //               <IconButton size="small" onClick={() => setHistory([])} disabled={isNanoActive} title="Ekranni tozalash">
// //                 <Trash2 size={14} style={{ color: isNanoActive ? '#333' : '#666' }} />
// //               </IconButton>
// //             </Box>
// //           </Box>

// //           {/* Terminal Asosiy Tana Qismi (Zich va ixcham dizayn) */}
// //           <Box onClick={focusInput} sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            
// //             {/* 🔴 NANO MUHIT REJIMI OCHILGANDA */}
// //             {isNanoActive ? (
// //               <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
// //                 <textarea
// //                   ref={nanoTextAreaRef}
// //                   value={nanoContent}
// //                   onChange={(e) => setNanoContent(e.target.value)}
// //                   style={{
// //                     flex: 1,
// //                     backgroundColor: '#000',
// //                     color: '#FFF',
// //                     border: 'none',
// //                     outline: 'none',
// //                     resize: 'none',
// //                     fontFamily: '"JetBrains Mono", "Fira Code", monospace',
// //                     fontSize: '0.9rem',
// //                     lineHeight: '1.4',
// //                   }}
// //                   placeholder="Matnni shu yerga yozing..."
// //                 />
// //                 {/* Nano Pastki Paneli (Xuddi Linuxdagidek) */}
// //                 <Box sx={{ bgcolor: '#FFF', color: '#000', display: 'flex', gap: 4, px: 1, py: 0.2, fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
// //                   <Box sx={{ display: 'flex', gap: 0.5 }}><Typography variant="caption" sx={{ fontWeight: 900 }}>^O</Typography> Saqlash (WriteOut)</Box>
// //                   <Box sx={{ display: 'flex', gap: 0.5 }}><Typography variant="caption" sx={{ fontWeight: 900 }}>^X</Typography> Chiqish (Exit)</Box>
// //                 </Box>
// //               </Box>
// //             ) : (
// //               /* 🟢 STANDART TERMINAL REJIMI */
// //               <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
// //                 <Typography sx={{ color: '#555', fontSize: '0.8rem', fontFamily: 'monospace', mb: 1, lineHeight: 1.3 }}>
// //                   Welcome to Cloud Terminal v1.0.4. Type 'help' for layout commands. Enter 'check' to verify task.
// //                   <br />═══════════════════════════════════════════════════════
// //                 </Typography>

// //                 {history.map((item, index) => (
// //                   <Box key={index} sx={{ mb: 1 }}>
// //                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
// //                       <Typography sx={{ color: '#39FF14', fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 'bold' }}>
// //                         user@sandbox:{currentDirectory}$
// //                       </Typography>
// //                       <Typography sx={{ color: '#FFF', fontFamily: 'monospace', fontSize: '0.85rem' }}>
// //                         {item.command}
// //                       </Typography>
// //                     </Box>
// //                     <Typography sx={{ color: '#A9FF99', whiteSpace: 'pre-wrap', pl: 2, mt: 0.2, fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.4 }}>
// //                       {item.output}
// //                     </Typography>
// //                   </Box>
// //                 ))}

// //                 {loading && (
// //                   <Typography sx={{ color: '#FFD700', fontFamily: 'monospace', fontSize: '0.85rem', mt: 1 }}>
// //                     Bajarilmoqda...
// //                   </Typography>
// //                 )}
// //                 <div ref={terminalEndRef} />
// //               </Box>
// //             )}
// //           </Box>

// //           {/* Terminal Input qismi (Faqat Nano yopiqligida ko'rinadi) */}
// //           {!isNanoActive && (
// //             <Box sx={{ bgcolor: '#050505', px: 2, py: 1, borderTop: '1px solid rgba(57, 255, 20, 0.1)' }}>
// //               <form onSubmit={handleCommandSubmit} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
// //                 <Typography sx={{ color: '#39FF14', fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 'bold', mr: 1, whiteSpace: 'nowrap' }}>
// //                   user@sandbox:{currentDirectory}$
// //                 </Typography>
// //                 <input
// //                   ref={inputRef}
// //                   type="text"
// //                   value={command}
// //                   onChange={(e) => setCommand(e.target.value)}
// //                   disabled={loading}
// //                   placeholder="Buyruqni kiriting..."
// //                   style={{
// //                     flex: 1,
// //                     background: 'transparent',
// //                     border: 'none',
// //                     outline: 'none',
// //                     color: '#39FF14',
// //                     fontFamily: '"JetBrains Mono", "Fira Code", monospace',
// //                     fontSize: '0.85rem',
// //                   }}
// //                 />
// //               </form>
// //             </Box>
// //           )}
// //         </Card>
// //       </Box>

// //       {/* 🟢 NOTIFICATION TIZIMI */}
// //       <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)}>
// //         <Alert severity="success" sx={{ bgcolor: '#121212', color: '#39FF14', border: '1px solid #39FF14' }}>
// //           {successMessage}
// //         </Alert>
// //       </Snackbar>

// //       <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
// //         <Alert severity="error" sx={{ bgcolor: '#121212', color: '#FF4444', border: '1px solid #FF4444' }}>
// //           {error}
// //         </Alert>
// //       </Snackbar>
// //     </Box>
// //   );
// // }


// import React, { useState, useRef, useEffect } from 'react';
// import { Box, Card, IconButton, Typography, Snackbar, Alert } from '@mui/material';
// import { Trash2, Terminal as TerminalIcon, Folder } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// // ==========================================
// // 🟢 IMPORT QISMI (Komponentlar va API sozlamalari)
// // ==========================================
// import api from '../config/api';
// import { useAuth } from '../context/AuthContext';
// import { UserProfileHeader } from '../components/UserProfileHeader';
// import { TaskPanel } from '../components/TaskPanel';
// import { NanoEditor } from '../components/NanoEditor';
// import { TerminalConsole } from '../components/TerminalConsole';
// import FileListVisualizer from '../components/FileListVisualizer'; 

// export default function Dashboard() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   // ==========================================
//   // 🟢 STATE-LAR (Holatlar boshqaruvi)
//   // ==========================================
//   const [command, setCommand] = useState('');
//   const [history, setHistory] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [currentDirectory, setCurrentDirectory] = useState('~'); 
  
//   // 🖥 Nano muharriri uchun kerakli statelar
//   const [isNanoActive, setIsNanoActive] = useState(false); // Nano rejimi yoqilgan/o'chirilganligi
//   const [nanoFileName, setNanoFileName] = useState('');     // Ochilgan fayl nomi
//   const [nanoContent, setNanoContent] = useState('');       // Fayl ichidagi matn (Kontent)
  
//   // 📋 Topshiriq va foydalanuvchi ma'lumotlari statelari
//   const [activeTask, setActiveTask] = useState<any>(null);
//   const [userStructure, setUserStructure] = useState<any>(null);
//   const [profile, setProfile] = useState<any>(null);
  
//   // 🔔 Bildirishnomalar statelari (Toast Notification)
//   const [success, setSuccess] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [error, setError] = useState('');

//   // ==========================================
//   // 🟢 REF-LAR (Fokus va Avto-scroll boshqaruvi)
//   // ==========================================
//   const terminalEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const nanoTextAreaRef = useRef<HTMLTextAreaElement>(null);

//   // 🎯 Fokusni boshqarish: Nano yoniqligiga qarab kerakli oynaga fokus beradi
//   const focusInput = () => {
//     if (!isNanoActive && inputRef.current) inputRef.current.focus();
//     else if (isNanoActive && nanoTextAreaRef.current) nanoTextAreaRef.current.focus();
//   };

//   // ==========================================
//   // 🟢 EFFEKTLAR (Side Effects)
//   // ==========================================
  
//   // 👤 Profil ma'lumotlarini backenddan yuklab olish qismi
//   const fetchUserProfile = async () => {
//     try {
//       const res = await api.get('/api/profile/');
//       if (Array.isArray(res.data) && res.data.length > 0) setProfile(res.data[0]);
//     } catch (err) {
//       console.error("Profil ma'lumotlarini yuklashda xatolik.");
//     }
//   };

//   useEffect(() => { fetchUserProfile(); }, []);
//   useEffect(() => { focusInput(); }, [isNanoActive, history]);

//   // ==========================================
//   // ⌨️ GNU NANO HOTKEY (Klaviatura tugmalari boshqaruvi)
//   // ==========================================
//   useEffect(() => {
//     const handleGlobalKeyDown = (e: KeyboardEvent) => {
//       if (isNanoActive) {
//         // 💾 Ctrl + O -> Faylni saqlash jarayoni
//         if (e.ctrlKey && e.key.toLowerCase() === 'o') {
//           e.preventDefault();
//           handleNanoSave();
//         }
//         // ❌ Ctrl + X -> Nano muharriridan chiqish jarayoni
//         if (e.ctrlKey && e.key.toLowerCase() === 'x') {
//           e.preventDefault();
//           setIsNanoActive(false); // Nano rejimini o'chirish
          
//           // Yangi fayllar ochilganda eski matn qolib ketmasligi uchun statelarni tozalaymiz
//           setNanoContent(''); 
//           setNanoFileName('');
          
//           setHistory(prev => [...prev, { 
//             command: `nano ${nanoFileName}`, 
//             output: 'GNU nano muharriridan chiqildi.', 
//             timestamp: new Date() 
//           }]);
//         }
//       }
//     };
//     window.addEventListener('keydown', handleGlobalKeyDown, true);
//     return () => window.removeEventListener('keydown', handleGlobalKeyDown, true);
//   }, [isNanoActive, nanoFileName, nanoContent]);

//   // ==========================================
//   // 💾 NANO SAQLASH FUNKSIYASI (Ctrl + O bosilganda)
//   // ==========================================
//   const handleNanoSave = async () => {
//     setLoading(true);
//     try {
//       // Backendga joriy yozilgan matn (nanoContent) yuboriladi
//       const res = await api.post('/terminal/', { 
//         command: `nano ${nanoFileName}`, 
//         content: nanoContent 
//       });
      
//       if (res.data.result?.status) {
//         setSuccessMessage('Fayl muvaffaqiyatli saqlandi! 💾');
//         setSuccess(true);
//         // Saqlangandan keyin fayl tizimi yangilansa, strukturani o'zgartiramiz
//         if (res.data.structure) setUserStructure(res.data.structure);
//       }
//     } catch (err) { 
//       setError('Faylni saqlashda ichki xatolik yuz berdi.'); 
//     } finally { 
//       setLoading(false); 
//     }
//   };

//   // ==========================================
//   // 🚀 TERMINAL BUYRUQLARINI REJA QILISH (Submit)
//   // ==========================================
//   const handleCommandSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!command.trim() || loading) return;

//     const currentCommand = command.trim();
//     setCommand('');
//     setLoading(true);

//     // 🧹 Clear buyrug'i terminal tarixini tozalaydi
//     if (currentCommand.toLowerCase() === 'clear') {
//       setHistory([]);
//       setLoading(false);
//       return;
//     }

//     // 📂 NANO BUYRUG'I TERMINALDA ISHGA TUSHGANDA (Fayl ochish)
//     if (currentCommand.startsWith('nano ')) {
//       const fileName = currentCommand.split(/\s+/)[1] || 'unnamed.txt';
//       setNanoFileName(fileName);
      
//       try {
//         const res = await api.post('/terminal/', { command: currentCommand });
//         const responseData = res.data;

//         // 🔍 BACKEND JAVOBINI NETWORKGA MOSLAB TEKSHIRISH (Eski ma'lumot o'chib ketmasligi uchun)
//         if (responseData.result && responseData.result.type === 'nano') {
//           // Backend javobidagi eski content mavjud bo'lsa uni oladi, aks holda bo'sh satr
//           const oldContent = responseData.result.content !== undefined ? responseData.result.content : '';
          
//           setNanoContent(oldContent); // 👈 Eski ma'lumotlar saqlangan holda editorga yuklanadi!
//           setIsNanoActive(true);      // Nano oynasini vizual ochish
//         }

//         // Yo'llar va joriy strukturani yangilash
//         if (responseData.current_path) setCurrentDirectory(responseData.current_path);
//         if (responseData.structure) setUserStructure(responseData.structure);

//       } catch (err) {
//         setHistory((prev) => [...prev, { command: currentCommand, output: "Faylni ochib bo'lmadi.", timestamp: new Date() }]);
//       } finally { 
//         setLoading(false); 
//       }
//       return;
//     }

//     // ⚙️ ODDY BUYRUQLAR IJROSI (ls, cd, mkdir, touch, rm va hkz)
//     try {
//       const res = await api.post('/terminal/', { command: currentCommand });
//       const responseData = res.data;

//       if (responseData.current_path) setCurrentDirectory(responseData.current_path);
//       if (responseData.structure) setUserStructure(responseData.structure);

//       // ✅ CHECK buyrug'i kiritilganda topshiriqni tekshirish mantiqi
//       if (currentCommand.toLowerCase() === 'check' && responseData.result?.status?.includes('correct')) {
//         setSuccessMessage('Topshiriq muvaffaqiyatli bajarildi! 🎉');
//         setSuccess(true);
//         setActiveTask(null);
//         setUserStructure(null);
//         fetchUserProfile(); // Profil ochkolarini yangilash
//       }

//       setHistory((prev) => [...prev, { command: currentCommand, output: responseData.result?.output || 'Bajarildi.', timestamp: new Date() }]);
//     } catch (err: any) {
//       setHistory((prev) => [...prev, { command: currentCommand, output: 'Xatolik: Buyruq ijrosida muammo.', timestamp: new Date() }]);
//     } finally { 
//       setLoading(false); 
//     }
//   };

//   // ==========================================
//   // 🎨 VIZUAL INTERFEYS (UI Render Qismi)
//   // ==========================================
//   return (
//     <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0A0A0A', overflow: 'hidden' }}>
      
//       {/* 👤 YUQORI PANEL: Profil va Foydalanuvchi ma'lumotlari */}
//       <UserProfileHeader username={user?.username} profile={profile} onLogout={() => { logout(); navigate('/auth'); }} />

//       {/* 🎛 ASOSIY ISHCHI SETKA (Grid Layout) */}
//       <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '42% 58%', gap: 2, p: 2, height: 'calc(100vh - 65px)', overflow: 'hidden' }}>
        
//         {/* 📝 CHAP TOMON YUQORI: Topshiriqlar paneli */}
//         <TaskPanel activeTask={activeTask} onGetTask={async () => {
//           try {
//             const res = await api.get('/task/');
//             if (res.data) { setActiveTask(res.data); setUserStructure([]); }
//           } catch { setError("Yangi topshiriq olishda xatolik."); }
//         }} />

//         {/* 📂 O'NG TOMON YUQORI: Sandbox Fayl Tizimi Daraxti */}
//         <Card sx={{ bgcolor: '#121212', border: '1px solid rgba(57, 255, 20, 0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
//           <Box sx={{ bgcolor: '#1A1A1A', px: 2, py: 1, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Folder size={14} style={{ color: '#FFD700' }} />
//             <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 600 }}>Sandbox Fayllar Tizimi</Typography>
//           </Box>
//           <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: '#0F0F0F' }}>
//             <FileListVisualizer structure={userStructure} />
//           </Box>
//         </Card>

//         {/* 🖥 PASTKI BUTUN PANEL: Terminal va Nano Muharriri oynasi */}
//         <Card sx={{ gridColumn: '1 / -1', bgcolor: '#000', border: '1px solid rgba(57, 255, 20, 0.25)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
//           {/* Terminal / Nano sarlavha qismi */}
//           <Box sx={{ bgcolor: '#1A1A1A', px: 2, py: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(57, 255, 20, 0.15)' }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <TerminalIcon size={14} style={{ color: '#39FF14' }} />
//               <Typography variant="caption" sx={{ color: '#B0B0B0', fontFamily: 'monospace' }}>
//                 {isNanoActive ? `GNU nano v5.0 — ${nanoFileName}` : `ilyos@cloud-sandbox: ${currentDirectory}`}
//               </Typography>
//             </Box>
//             <IconButton size="small" onClick={() => setHistory([])} disabled={isNanoActive}><Trash2 size={14} style={{ color: '#666' }} /></IconButton>
//           </Box>

//           {/* 🔀 SHARTLI RENDER: Nano yoqilgan bo'lsa NanoEditor, aks holda Terminal Console ko'rinadi */}
//           <Box onClick={focusInput} sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column' }}>
//             {isNanoActive ? (
//               // 🔴 NANO EDITOR OYNASI: Eski ma'lumotlar bilan ochiladigan qism
//               <NanoEditor fileName={nanoFileName} content={nanoContent} setContent={setNanoContent} textAreaRef={nanoTextAreaRef} />
//             ) : (
//               // 🟢 TERMINAL OYNASI: Buyruqlar kiritiladigan qism
//               <TerminalConsole
//                 history={history} currentDirectory={currentDirectory} command={command} setCommand={setCommand}
//                 loading={loading} onSubmit={handleCommandSubmit} inputRef={inputRef} terminalEndRef={terminalEndRef}
//                 availableSuggestions={userStructure || ['help', 'clear', 'check', 'ls', 'cd']}
//               />
//             )}
//           </Box>
//         </Card>
//       </Box>

//       {/* ==========================================
//       // 🔔 BILDIRISHNOMALAR (Success & Error Snackbars)
//       // ========================================== */}
//       <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)}>
//         <Alert severity="success" sx={{ bgcolor: '#121212', color: '#39FF14', border: '1px solid #39FF14' }}>{successMessage}</Alert>
//       </Snackbar>
//       <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
//         <Alert severity="error" sx={{ bgcolor: '#121212', color: '#FF4444', border: '1px solid #FF4444' }}>{error}</Alert>
//       </Snackbar>
//     </Box>
//   );
// }





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
  // 🟢 EFFEKTLAR (Side Effects)
  // ==========================================
  
  // 👤 Profil ma'lumotlarini backenddan yuklab olish qismi
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
        // 💾 Ctrl + O -> Faylni saqlash jarayoni
        if (e.ctrlKey && e.key.toLowerCase() === 'o') {
          e.preventDefault();
          handleNanoSave();
        }
        // ❌ Ctrl + X -> Nano muharriridan chiqish jarayoni
        if (e.ctrlKey && e.key.toLowerCase() === 'x') {
          e.preventDefault();
          setIsNanoActive(false); // Nano rejimini o'chirish
          
          setHistory(prev => [...prev, { 
            command: `nano ${nanoFileName}`, 
            output: 'GNU nano muharriridan chiqildi.', 
            timestamp: new Date() 
          }]);

          // Statelarni tozalash (Keyingi fayl toza ochilishi uchun)
          setNanoContent(''); 
          setNanoFileName('');
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, true);
  }, [isNanoActive, nanoFileName, nanoContent]);

  // ==========================================
  // 💾 NANO SAQLASH FUNKSIYASI (Ctrl + O bosilganda)
  // ==========================================
  const handleNanoSave = async () => {
    if (!nanoFileName || loading) return;
    setLoading(true);
    try {
      // 🔥 BACKEND TALAB QILGAN FORMAT: type, path va content kalitlari yuboriladi
      const res = await api.post('/terminal/', { 
        type: "nano_save",
        path: nanoFileName,
        content: nanoContent 
      });
      
      if (res.data) {
        setSuccessMessage('Fayl muvaffaqiyatli saqlandi! 💾');
        setSuccess(true);
        // Saqlangandan keyin fayl tizimi yangilansa, strukturani o'zgartiramiz
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
  // 🚀 TERMINAL BUYRUQLARINI SUBMIT QILISH
  // ==========================================
  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || loading) return;

    const currentCommand = command.trim();
    setCommand('');
    setLoading(true);

    // 🧹 Clear buyrug'i terminal tarixini tozalaydi
    if (currentCommand.toLowerCase() === 'clear') {
      setHistory([]);
      setLoading(false);
      return;
    }

    // 📂 NANO BUYRUG'I TERMINALDA ISHGA TUSHGANDA (Fayl ochish)
    if (currentCommand.startsWith('nano ')) {
      const fileName = currentCommand.split(/\s+/)[1] || 'unnamed.txt';
      setNanoFileName(fileName);
      
      try {
        const res = await api.post('/terminal/', { 
          type: "regular_command", // backend logikasiga mos ravishda buyruq turi
          command: currentCommand 
        });
        const responseData = res.data;

        // 🔥 BACKEND JAVOBIGA MOSLASH: result.content ichidagi matnni xavfsiz qidiramiz
        let existingContent = '';
        if (responseData.result && responseData.result.content !== undefined) {
          existingContent = responseData.result.content;
        } else if (responseData.content !== undefined) {
          existingContent = responseData.content;
        }
        
        setNanoContent(existingContent); // 👈 Eski ma'lumotlar saqlangan holda yuklanadi!
        setIsNanoActive(true);      // Nano oynasini vizual ochish

        // Yo'llar va joriy strukturani yangilash
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

    // ⚙️ ODDIY BUYRUQLAR IJROSI (ls, cd, mkdir, touch, rm va hkz)
    try {
      const res = await api.post('/terminal/', { 
        type: "regular_command",
        command: currentCommand 
      });
      const responseData = res.data;

      if (responseData.current_path) setCurrentDirectory(responseData.current_path);
      if (responseData.structure) setUserStructure(responseData.structure);

      // Topshiriq tekshiruvi muvaffaqiyatli bo'lsa
      if (currentCommand.toLowerCase() === 'check' && (responseData.result?.status?.includes('correct') || responseData.status?.includes('correct'))) {
        setSuccessMessage('Topshiriq muvaffaqiyatli bajarildi! 🎉');
        setSuccess(true);
        setActiveTask(null);
        setUserStructure(null);
        fetchUserProfile();
      }

      const outputText = responseData.output || responseData.result?.output || 'Buyruq bajarildi.';
      setHistory((prev) => [...prev, { command: currentCommand, output: outputText, timestamp: new Date() }]);
    } catch (err: any) {
      console.error("Buyruq xatosi:", err);
      const errText = err.response?.data?.detail || err.response?.data?.output || 'Xatolik: Buyruq ijrosida muammo.';
      setHistory((prev) => [...prev, { command: currentCommand, output: errText, timestamp: new Date() }]);
    } finally { 
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
      />

      {/* 📊 ASOSI_ISHCHI PANELI */}
      <Box sx={{ 
        flex: 1, 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gridTemplateRows: '42% 58%', 
        gap: 2, 
        p: 2, 
        overflow: 'hidden',
        height: 'calc(100vh - 65px)' 
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
  /* 📝 NANO EDITOR INTEGRATSIYASI */
  <NanoEditor 
    fileName={nanoFileName}
    content={nanoContent}
    setContent={setNanoContent}
    textAreaRef={nanoTextAreaRef as any}
  />
) : (
  /* 🟢 KLASSIK TERMINAL OYNASI */
  <TerminalConsole 
    history={history} 
    loading={loading} 
    currentDirectory={currentDirectory} 
    command={command}
    setCommand={setCommand}
    inputRef={inputRef} // 👈 To'g'rilandi: 'nanoTextAreaRef as any' o'rniga haqiqiy inputRef berildi!
    onSubmit={handleCommandSubmit}
    terminalEndRef={terminalEndRef}
  />
)}
          </Box>

          
        </Card>
      </Box>

      {/* 🔔 STATUS NOTIFICATION (TOAST) TIZIMI */}
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
  );
}