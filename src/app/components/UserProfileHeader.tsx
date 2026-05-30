import React, { useState } from 'react';
import { Box, Paper, Typography, Avatar, LinearProgress, IconButton, Menu, MenuItem } from '@mui/material';
import { ChevronDown } from 'lucide-react';

interface UserProfile {
  level: number;
  xp: number;
  success_streak: number;
  failed_attempts: number;
  total_completed_tasks: number;
}

interface UserProfileHeaderProps {
  username?: string;
  profile: UserProfile | null;
  onLogout: () => void;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ username, profile, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  
  const currentXpPercentage = profile ? Math.min((profile.xp / 100) * 100, 100) : 0;

  return (
    <Paper elevation={0} sx={{ bgcolor: '#121212', borderBottom: '1px solid rgba(57, 255, 20, 0.2)', px: 3, py: 1.2, zIndex: 10 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar sx={{ bgcolor: '#39FF14', color: '#121212', width: 38, height: 38, fontWeight: 700 }}>
            {username ? username[0].toUpperCase() : 'U'}
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ color: '#FFF', fontWeight: 600, fontSize: '0.95rem' }}>{username || 'Foydalanuvchi'}</Typography>
              <Typography variant="caption" sx={{ bgcolor: 'rgba(57, 255, 20, 0.1)', color: '#39FF14', px: 1, py: 0.2, borderRadius: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>
                LVL {profile?.level || 1}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 220, mt: 0.5 }}>
              <LinearProgress variant="determinate" value={currentXpPercentage} sx={{ flex: 1, height: 4, bgcolor: '#2A2A2A', borderRadius: 2, '& .MuiLinearProgress-bar': { bgcolor: '#39FF14' } }} />
              <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{profile?.xp || 0} / 100 XP</Typography>
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="caption" sx={{ color: '#B0B0B0' }}>Streak: <span style={{ color: '#39FF14', fontWeight: 'bold' }}>{profile?.success_streak || 0} 🔥</span></Typography>
            <Typography variant="caption" sx={{ color: '#B0B0B0' }}>Bitirildi: <span style={{ color: '#FFF', fontWeight: 'bold' }}>{profile?.total_completed_tasks || 0}</span></Typography>
          </Box>
          <IconButton onClick={handleMenu} sx={{ color: '#39FF14' }} title="Sozlamalar"><ChevronDown size={18} /></IconButton>
        </Box>
        
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          <MenuItem onClick={() => { handleCloseMenu(); onLogout(); }}>Chiqish</MenuItem>
        </Menu>
      </Box>
    </Paper>
  );
};

export default UserProfileHeader;