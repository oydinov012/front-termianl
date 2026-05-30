import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

// ==========================================
// 🟢 PROPS INTERFACE (Ma'lumotlar turlari)
// ==========================================
interface NanoEditorProps {
  fileName: string;                                          // Ochilgan fayl nomi
  content: string;                                           // Backenddan kelgan va tahrirlanayotgan eski/yangi matn
  setContent: (value: string) => void;                       // Dashboarddagi nanoContent stateni yangilovchi funksiya
  textAreaRef: React.RefObject<HTMLTextAreaElement | null>;  // Kursor fokusini ushlab turuvchi ref
}

export const NanoEditor: React.FC<NanoEditorProps> = ({ fileName, content, setContent, textAreaRef }) => {
  
  // ==========================================
  // 🎯 AVTO-FOKUS & KURSORNI OXIRIGA OLIB O'TISH
  // ==========================================
  useEffect(() => {
    if (textAreaRef.current) {
      // Oyna render bo'lishi bilan foydalanuvchi klaviaturada yozishni boshlashi mumkin
      textAreaRef.current.focus();
      
      // 🔥 TO'G'RILANDI: Kontent haqiqatda yuklanganidan keyin kursorni oxiriga suramiz
      const length = content.length;
      textAreaRef.current.setSelectionRange(length, length);
    }
    // 💡 content o'zgarganda (ya'ni backenddan ma'lumot kelib tushganda) ham kursor to'g'ri joylashadi
  }, [textAreaRef, content]); 

  // ==========================================
  // ⌨️ TAB KLAVISHI BOSILGANDAGI MANTIQ (Fokus qochib ketishini oldini olish)
  // ==========================================
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault(); // Brauzer fokusini keyingi elementga o'tkazib yubormaslik

      const textarea = e.currentTarget;
      const start = textarea.selectionStart; // Kursorgacha bo'lgan matn chegarasi
      const end = textarea.selectionEnd;     // Kursordan keyingi matn chegarasi

      // Haqiqiy Linux terminali kabi 4 ta bo'shliq qo'shamiz
      const tabSpace = "    "; 
      const newContent = content.substring(0, start) + tabSpace + content.substring(end);
      
      // Dashboarddagi asosiy stateni yangilaymiz (Eski ma'lumot yo'qolmaydi)
      setContent(newContent);

      // Kursor joylashuvini aynan o'sha tab qo'shilgan joyda ushlab qolamiz
      setTimeout(() => {
        if (textarea) {
          textarea.selectionStart = textarea.selectionEnd = start + tabSpace.length;
        }
      }, 0);
    }
  };

  // ==========================================
  // ✍️ ODDIY MATN KIRITILGANDA KURSORNI NAZORAT QILISH
  // ==========================================
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    // Asosiy stateni yangilash
    setContent(textarea.value);

    // 🔴 ESKI MA'LUMOTLAR USTIGA YOZILGANDA KURSOR SAKRAB KETMASLIGI UCHUN:
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.setSelectionRange(selectionStart, selectionEnd);
      }
    }, 0);
  };

  // ==========================================
  // 🎨 VIZUAL INTERFEYS (UI Render)
  // ==========================================
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', bgcolor: '#000' }}>
      
      {/* 🔝 NANO YUQORI SARLAVHASI (GNU Nano Visual Bar) */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, py: 0.3, bgcolor: '#1A1A1A', borderBottom: '1px solid #222' }}>
        <Typography variant="caption" sx={{ color: '#FFF', fontFamily: 'monospace', fontSize: '0.75rem' }}>
          GNU nano 5.0
        </Typography>
        <Typography variant="caption" sx={{ color: '#FFF', fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 'bold' }}>
          Fayl: {fileName}
        </Typography>
        <Typography variant="caption" sx={{ color: '#39FF14', fontFamily: 'monospace', fontSize: '0.75rem' }}>
          Tahrirlashda
        </Typography>
      </Box>

      {/* 📝 MATN YOZISH MAYDONI (Textarea) */}
      <textarea
        ref={textAreaRef}
        value={content}                      // 👈 Dashboarddan kelayotgan (eski ma'lumotlarni saqlagan) kontent
        onChange={handleTextChange}          // 👈 Kursorni sakratmaydigan yangi funksiya
        onKeyDown={handleKeyDown}            // 👈 Tab tugmasini boshqaruvchi funksiya
        style={{
          flex: 1,
          backgroundColor: '#000',
          color: '#FFF',
          border: 'none',
          outline: 'none',
          resize: 'none',
          padding: '12px',
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontSize: '0.9rem',
          lineHeight: '1.5',
        }}
        placeholder="Fayl bo'sh. Matn yozishni boshlashingiz mumkin..."
      />

      {/* 📥 LINUX USLUBIDAGI PASTKI STATUS PANEL (Shortcuts) */}
      <Box sx={{ bgcolor: '#FFF', color: '#000', display: 'flex', gap: 4, px: 1, py: 0.4, fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
        
        {/* 💾 Ctrl + O -> Saqlash haqida ko'rsatma */}
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          <Typography variant="caption" sx={{ fontWeight: 900, bgcolor: '#000', color: '#FFF', px: 0.4, py: 0.1, borderRadius: '2px', fontSize: '0.65rem' }}>
            ^O
          </Typography> 
          Saqlash (WriteOut)
        </Box>
        
        {/* ❌ Ctrl + X -> Chiqish haqida ko'rsatma */}
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          <Typography variant="caption" sx={{ fontWeight: 900, bgcolor: '#000', color: '#FFF', px: 0.4, py: 0.1, borderRadius: '2px', fontSize: '0.65rem' }}>
            ^X
          </Typography> 
          Chiqish (Exit)
        </Box>
      </Box>

    </Box>
  );
};

export default NanoEditor;