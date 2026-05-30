import React from 'react';
import { Card, CardContent, Box, Typography, Button } from '@mui/material';
import { CheckCircle, Play, RefreshCw } from 'lucide-react';

interface ActiveTask {
  task_id: number;
  title: string;
  description: string;
  level: number;
  xp: number;
  status: string;
  structure: Record<string, any>; 
  formatted_structure: string;
}

interface TaskPanelProps {
  activeTask: ActiveTask | null;
  onGetTask: () => void;
}

export const TaskPanel: React.FC<TaskPanelProps> = ({ activeTask, onGetTask }) => {
  return (
    <Card sx={{ bgcolor: '#121212', border: '1px solid rgba(57, 255, 20, 0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
      
      {/* 📌 PANEL SARLAVHASI */}
      <Box sx={{ bgcolor: '#1A1A1A', px: 2, py: 1, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle size={14} style={{ color: '#39FF14' }} />
          <Typography variant="subtitle2" sx={{ color: '#39FF14', fontWeight: 600, fontSize: '0.85rem' }}>
            {activeTask ? `Joriy Topshiriq #${activeTask.task_id}` : 'Joriy Topshiriq'}
          </Typography>
        </Box>
        
        {/* 🔄 TUGMA LOGIKASI: Task bo'lsa "Yangilash", bo'lmasa "Topshiriq Olish" */}
        <Button 
          size="small" 
          variant="outlined" 
          onClick={onGetTask} 
          startIcon={activeTask ? <RefreshCw size={12} /> : <Play size={12} />} 
          sx={{ 
            color: '#39FF14', 
            borderColor: '#39FF14', 
            fontSize: '0.75rem', 
            py: 0.2, 
            px: 1.5,
            '&:hover': { borderColor: '#2ECC11', bgcolor: 'rgba(57, 255, 20, 0.05)' } 
          }}
        >
          {activeTask ? "Yangilash" : "Topshiriq Olish"}
        </Button>
      </Box>

      {/* 📝 PANEL TANA QISMI */}
      <CardContent sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {activeTask ? (
          <>
            {/* Topshiriq nomi */}
            <Typography variant="h6" sx={{ color: '#FFF', fontSize: '1rem', fontWeight: 600, textTransform: 'capitalize' }}>
              {activeTask.title}
            </Typography>
            
            {/* Topshiriq tavsifi */}
            <Typography variant="body2" sx={{ color: '#B0B0B0', fontSize: '0.85rem', lineHeight: 1.5 }}>
              {activeTask.description}
            </Typography>

            {/* Kutilayotgan fayllar ierarxiyasi */}
            {activeTask.formatted_structure && (
              <Box sx={{ mt: 'auto', bgcolor: '#000', p: 1.5, borderRadius: 1, border: '1px solid #2A2A2A' }}>
                <Typography variant="caption" sx={{ color: '#FF8C00', fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                  Kutilayotgan ierarxiya:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: '"JetBrains Mono", monospace', color: '#00FF66', fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
                  {activeTask.formatted_structure}
                </Typography>
                
                {/* 🏆 MUKOFOT VA DARAJA MINI-BARI */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5, pt: 1, borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                  <Typography variant="caption" sx={{ color: '#888' }}>
                    Daraja: <span style={{ color: '#FFF', fontWeight: 'bold' }}>{activeTask.level}</span>
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888' }}>
                    Mukofot: <span style={{ color: '#39FF14', fontWeight: 'bold' }}>+{activeTask.xp} XP</span>
                  </Typography>
                </Box>
              </Box>
            )}
          </>
        ) : (
          /* 📭 BO'SH HOLAT (TASK YO'QLIGIDA) */
          <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
              Sizda faol topshiriq yo'q.
            </Typography>
            <Typography variant="caption" sx={{ color: '#444', textAlign: 'center' }}>
              Tizimdan yangisini yuklab olish uchun yuqoridagi tugmani bosing yoki terminalga <b>run</b> buyrug'ini kiriting.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskPanel;