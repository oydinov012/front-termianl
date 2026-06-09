import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Avatar, 
  LinearProgress, 
  IconButton, 
  Menu, 
  MenuItem,
  Dialog,
  TextField,
  InputAdornment,
  Grid // Asosiy paketdan import qilindi
} from '@mui/material';
import { ChevronDown, LogOut, Settings, Terminal, Eye, EyeOff } from 'lucide-react';

interface UserProfile {
  level: number;
  xp: number;
  success_streak: number;
  failed_attempts: number;
  total_completed_tasks: number;
}

interface UserProfileHeaderProps {
  username?: string;
  currentEmail?: string;
  currentFirstName?: string;
  currentLastName?: string;
  currentPassword?: string;
  profile: UserProfile | null;
  onLogout: () => void;
  onUpdateProfile: (
    updatedData: { username?: string; first_name?: string; last_name?: string; email?: string; password?: string; }, 
    isPartial?: boolean
  ) => Promise<void>; 
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ 
  username = '', 
  currentEmail = '', 
  currentFirstName = '', 
  currentLastName = '',
  currentPassword = '',
  profile, 
  onLogout, 
  onUpdateProfile 
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);

  // Oyna ochilganda har doim mavjud (eski) ma'lumotlarni to'g'ri yuklash
  useEffect(() => {
    if (openEditDialog) {
      setEditUsername(username);
      setFirstName(currentFirstName);
      setLastName(currentLastName);
      setEmail(currentEmail);
      setPassword(currentPassword || '********');
      setShowPassword(false);
    }
  }, [openEditDialog, username, currentEmail, currentFirstName, currentLastName, currentPassword]);

  // Saqlash logikasi
  const triggerSave = async () => {
    const dataToSend: any = {};
    
    if (editUsername.trim() && editUsername !== username) dataToSend.username = editUsername.trim();
    if (firstName.trim() && firstName !== currentFirstName) dataToSend.first_name = firstName.trim();
    if (lastName.trim() && lastName !== currentLastName) dataToSend.last_name = lastName.trim();
    if (email.trim() && email !== currentEmail) dataToSend.email = email.trim();
    
    if (password.trim() && password !== '********' && password !== currentPassword) {
      dataToSend.password = password;
    }

    if (Object.keys(dataToSend).length === 0) {
      handleCloseEditDialog();
      return;
    }

    await onUpdateProfile(dataToSend, true);
    handleCloseEditDialog();
  };

  // Hotkeys listener (Ctrl+O, Ctrl+X)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!openEditDialog) return;

      if (e.ctrlKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        triggerSave();
      }
      
      if (e.ctrlKey && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        handleCloseEditDialog();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openEditDialog, editUsername, firstName, lastName, email, password]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
    handleCloseMenu(); 
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSave();
  };

  const currentXpPercentage = profile ? Math.min((profile.xp / 100) * 100, 100) : 0;

  const terminalInputStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#050505 !important',
      borderRadius: '4px',
      '& input': {
        color: '#FFF !important',
        fontFamily: 'monospace !important',
        fontSize: '1rem !important',
        WebkitTextFillColor: '#FFF !important',
        WebkitBoxShadow: '0 0 0 100px #050505 inset !important',
      },
      '& fieldset': { borderColor: 'rgba(57, 255, 20, 0.4)' },
      '&:hover fieldset': { borderColor: '#39FF14' },
      '&.Mui-focused fieldset': { borderColor: '#39FF14', boxShadow: '0 0 15px rgba(57, 255, 20, 0.4)' }
    }
  };

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
        
        <Menu 
          anchorEl={anchorEl} 
          open={Boolean(anchorEl)} 
          onClose={handleCloseMenu}
          PaperProps={{
            sx: {
              bgcolor: '#1A1A1A',
              border: '1px solid rgba(57, 255, 20, 0.2)',
              color: '#FFF',
              mt: 1,
              '& .MuiMenuItem-root': {
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                gap: 1.5,
                py: 1,
                px: 2,
                '&:hover': { bgcolor: 'rgba(57, 255, 20, 0.1)', color: '#39FF14' }
              }
            }
          }}
        >
          <MenuItem onClick={handleOpenEditDialog}>
            <Settings size={16} />
            Profilni tahrirlash
          </MenuItem>
          <MenuItem onClick={() => { handleCloseMenu(); onLogout(); }} sx={{ color: '#FF4444', '&:hover': { color: '#FF4444 !important', bgcolor: 'rgba(255, 68, 68, 0.1) !important' } }}>
            <LogOut size={16} />
            Chiqish
          </MenuItem>
        </Menu>
      </Box>

      {/* 🕶️ FULL-SCREEN DIALOG PANEL (CYBERPUNK TERMINAL STYLE) */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseEditDialog}
        fullScreen
        PaperProps={{
          component: 'form',    
          onSubmit: handleFormSubmit, 
          autoComplete: 'off',
          sx: {
            bgcolor: '#030303',
            color: '#39FF14',
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 700, px: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, borderBottom: '1px dashed rgba(57, 255, 20, 0.4)', pb: 2 }}>
            <Terminal size={24} />
            <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
              /root/user/profile_editor.exe
            </Typography>
          </Box>

          {/* Form Fields */}
          <Grid container spacing={3}>
            {/* Username */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Foydalanuvchi nomi"
                variant="outlined"
                type="text"
                name="terminal_secure_root_user_login"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                slotProps={{ htmlInput: { autoComplete: 'one-time-code', dataFormType: 'other' } }}
                InputLabelProps={{ style: { color: 'rgba(57, 255, 20, 0.7)', fontFamily: 'monospace' } }}
                sx={terminalInputStyle}
              />
            </Grid>
            
            {/* Email */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email"
                type="text"
                variant="outlined"
                name="terminal_secure_sys_email_addr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                slotProps={{ htmlInput: { autoComplete: 'one-time-code', dataFormType: 'other' } }}
                InputLabelProps={{ style: { color: 'rgba(57, 255, 20, 0.7)', fontFamily: 'monospace' } }}
                sx={terminalInputStyle}
              />
            </Grid>

            {/* First Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Ism"
                type="text"
                variant="outlined"
                name="terminal_secure_meta_fname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                slotProps={{ htmlInput: { autoComplete: 'one-time-code', dataFormType: 'other' } }}
                InputLabelProps={{ style: { color: 'rgba(57, 255, 20, 0.7)', fontFamily: 'monospace' } }}
                sx={terminalInputStyle}
              />
            </Grid>

            {/* Last Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Familiya"
                type="text"
                variant="outlined"
                name="terminal_secure_meta_lname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                slotProps={{ htmlInput: { autoComplete: 'one-time-code', dataFormType: 'other' } }}
                InputLabelProps={{ style: { color: 'rgba(57, 255, 20, 0.7)', fontFamily: 'monospace' } }}
                sx={terminalInputStyle}
              />
            </Grid>

            {/* Password */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Parol"
                type="text"
                variant="outlined"
                name="terminal_secure_auth_password_hash_key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{ htmlInput: { autoComplete: 'one-time-code', dataFormType: 'other' } }}
                InputLabelProps={{ style: { color: '#FF4444', fontFamily: 'monospace' } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: '#FF4444' }} edge="end">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  ...terminalInputStyle,
                  '& .MuiOutlinedInput-root': {
                    ...terminalInputStyle['& .MuiOutlinedInput-root'],
                    '& input': {
                      color: '#FF4444 !important',
                      fontFamily: 'monospace !important',
                      fontSize: '1rem !important',
                      letterSpacing: showPassword ? '0px' : '4px',
                      WebkitTextFillColor: '#FF4444 !important',
                      WebkitBoxShadow: '0 0 0 100px #050505 inset !important',
                      WebkitTextSecurity: showPassword ? 'none' : 'disc',
                      textSecurity: showPassword ? 'none' : 'disc', 
                    },
                    '& fieldset': { borderColor: 'rgba(255, 68, 68, 0.5)' },
                    '&:hover fieldset': { borderColor: '#FF4444' },
                    '&.Mui-focused fieldset': { borderColor: '#FF4444', boxShadow: '0 0 15px rgba(255, 68, 68, 0.4)' }
                  }
                }}
              />
            </Grid>
          </Grid>

          {/* Hotkeys Panel */}
          <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(57, 255, 20, 0.2)', pt: 2 }}>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'rgba(57, 255, 20, 0.6)' }}>
                [Ctrl + O] Saqlash va Chiqish
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'rgba(255, 68, 68, 0.6)' }}>
                [Ctrl + X] Bekor qilish
              </Typography>
            </Box>
          </Box>

          {/* Terminal Actions */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <button
              type="submit"
              style={{
                flex: 1,
                background: 'rgba(57, 255, 20, 0.1)',
                border: '1px solid #39FF14',
                color: '#39FF14',
                padding: '12px',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}
            >
              EXECUTE (SAVE)
            </button>
            <button
              type="button"
              onClick={handleCloseEditDialog}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 68, 68, 0.4)',
                color: '#FF4444',
                padding: '12px 24px',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                cursor: 'pointer',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}
            >
              ABORT
            </button>
          </Box>
        </Box>
      </Dialog>
    </Paper>
  );
};

export default UserProfileHeader;