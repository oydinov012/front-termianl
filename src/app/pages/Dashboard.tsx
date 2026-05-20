import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  LinearProgress,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import {
  Send,
  Trash2,
  LogOut,
  User,
  Flame,
  XCircle,
  CheckCircle2,
  Play,
  ChevronDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

interface CommandHistory {
  command: string;
  output: string;
  timestamp: Date;
}

interface UserStats {
  level: number;
  xp: number;
  maxXp: number;
  successStreak: number;
  failedAttempts: number;
  totalCompleted: number;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Mock stats - replace with real API data
  const [stats, setStats] = useState<UserStats>({
    level: 5,
    xp: 350,
    maxXp: 500,
    successStreak: 12,
    failedAttempts: 3,
    totalCompleted: 28,
  });

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setLoading(true);
    const currentCommand = command;
    setCommand('');

    try {
      const response = await api.post('/terminal/', {
        command: currentCommand,
      });

      setHistory((prev) => [
        ...prev,
        {
          command: currentCommand,
          output: response.data.output || response.data.result || 'Command executed successfully',
          timestamp: new Date(),
        },
      ]);
    } catch (error: any) {
      setHistory((prev) => [
        ...prev,
        {
          command: currentCommand,
          output: error.response?.data?.error || 'Command failed',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRunTask = async () => {
    if (!taskTitle.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      await api.post('/task/', {
        title: taskTitle,
        description: taskDescription,
      });
      setSuccess(true);
      setTaskTitle('');
      setTaskDescription('');
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const clearTerminal = () => {
    setHistory([]);
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  const xpPercentage = (stats.xp / stats.maxXp) * 100;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0A0A0A' }}>
      {/* Top Navbar */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#121212',
          borderBottom: '1px solid rgba(57, 255, 20, 0.2)',
          px: 3,
          py: 2,
        }}
      >
        <Box className="flex items-center justify-between">
          <Box className="flex items-center gap-4">
            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              <Avatar
                sx={{
                  bgcolor: '#39FF14',
                  color: '#121212',
                  width: 48,
                  height: 48,
                  fontWeight: 700,
                  border: '2px solid #39FF14',
                  boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)',
                }}
              >
                {getInitials()}
              </Avatar>
            </IconButton>

            <Box>
              <Box className="flex items-center gap-2">
                <Typography sx={{ color: '#FFF', fontWeight: 700, fontSize: '1.1rem' }}>
                  {user?.username || 'User'}
                </Typography>
                <Chip
                  label={`Level ${stats.level}`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(57, 255, 20, 0.15)',
                    color: '#39FF14',
                    border: '1px solid #39FF14',
                    fontWeight: 700,
                  }}
                />
              </Box>
              <Box sx={{ width: 200, mt: 0.5 }}>
                <Box className="flex justify-between mb-1">
                  <Typography variant="caption" sx={{ color: '#B0B0B0' }}>
                    XP: {stats.xp}/{stats.maxXp}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={xpPercentage}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: '#2A2A2A',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#39FF14',
                      boxShadow: '0 0 10px rgba(57, 255, 20, 0.5)',
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          <ChevronDown className="w-5 h-5" style={{ color: '#39FF14' }} />
        </Box>
      </Paper>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            bgcolor: '#1E1E1E',
            border: '1px solid rgba(57, 255, 20, 0.2)',
            mt: 1,
          },
        }}
      >
        <MenuItem onClick={() => { setEditProfileOpen(true); handleCloseMenu(); }}>
          <User className="w-4 h-4 mr-2" style={{ color: '#39FF14' }} />
          Edit Profile
        </MenuItem>
        <Divider sx={{ borderColor: '#2A2A2A' }} />
        <MenuItem onClick={handleLogout} sx={{ color: '#FF4444' }}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 2, p: 2 }}>
        {/* Top-Left: Task Creation Panel */}
        <Card
          sx={{
            bgcolor: '#1E1E1E',
            border: '1px solid rgba(57, 255, 20, 0.2)',
            boxShadow: '0 0 30px rgba(57, 255, 20, 0.1)',
          }}
        >
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ color: '#39FF14', mb: 2, fontWeight: 700 }}>
              Create Task
            </Typography>
            <TextField
              fullWidth
              label="Task Name"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { fontFamily: 'monospace' } }}
              inputProps={{ style: { fontFamily: 'monospace' } }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              sx={{ mb: 2, flex: 1 }}
              InputLabelProps={{ style: { fontFamily: 'monospace' } }}
              inputProps={{ style: { fontFamily: 'monospace' } }}
            />
            <Button
              variant="contained"
              endIcon={<Play className="w-4 h-4" />}
              onClick={handleRunTask}
              sx={{
                alignSelf: 'flex-end',
                bgcolor: '#39FF14',
                color: '#121212',
                fontWeight: 700,
                '&:hover': { bgcolor: '#2ECC11' },
              }}
            >
              Run
            </Button>
          </CardContent>
        </Card>

        {/* Top-Right: Profile Stats & Streaks */}
        <Card
          sx={{
            bgcolor: '#1E1E1E',
            border: '1px solid rgba(57, 255, 20, 0.2)',
            boxShadow: '0 0 30px rgba(57, 255, 20, 0.1)',
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: '#39FF14', mb: 3, fontWeight: 700 }}>
              Statistics
            </Typography>
            <Box className="grid grid-cols-3 gap-3">
              <Paper
                sx={{
                  bgcolor: '#121212',
                  p: 2,
                  textAlign: 'center',
                  border: '1px solid rgba(255, 140, 0, 0.3)',
                }}
              >
                <Flame className="w-8 h-8 mx-auto mb-2" style={{ color: '#FF8C00' }} />
                <Typography variant="h4" sx={{ color: '#FF8C00', fontWeight: 700 }}>
                  {stats.successStreak}
                </Typography>
                <Typography variant="caption" sx={{ color: '#B0B0B0' }}>
                  Success Streak
                </Typography>
              </Paper>

              <Paper
                sx={{
                  bgcolor: '#121212',
                  p: 2,
                  textAlign: 'center',
                  border: '1px solid rgba(255, 68, 68, 0.3)',
                }}
              >
                <XCircle className="w-8 h-8 mx-auto mb-2" style={{ color: '#FF4444' }} />
                <Typography variant="h4" sx={{ color: '#FF4444', fontWeight: 700 }}>
                  {stats.failedAttempts}
                </Typography>
                <Typography variant="caption" sx={{ color: '#B0B0B0' }}>
                  Failed Attempts
                </Typography>
              </Paper>

              <Paper
                sx={{
                  bgcolor: '#121212',
                  p: 2,
                  textAlign: 'center',
                  border: '1px solid rgba(57, 255, 20, 0.3)',
                }}
              >
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: '#39FF14' }} />
                <Typography variant="h4" sx={{ color: '#39FF14', fontWeight: 700 }}>
                  {stats.totalCompleted}
                </Typography>
                <Typography variant="caption" sx={{ color: '#B0B0B0' }}>
                  Total Completed
                </Typography>
              </Paper>
            </Box>
          </CardContent>
        </Card>

        {/* Bottom: Terminal Window */}
        <Card
          sx={{
            gridColumn: '1 / -1',
            bgcolor: '#000',
            border: '1px solid rgba(57, 255, 20, 0.3)',
            boxShadow: '0 0 40px rgba(57, 255, 20, 0.15)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Terminal Header */}
          <Box
            sx={{
              bgcolor: '#1A1A1A',
              px: 2,
              py: 1,
              borderBottom: '1px solid rgba(57, 255, 20, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box className="flex items-center gap-2">
              <Box className="w-3 h-3 rounded-full bg-red-500" />
              <Box className="w-3 h-3 rounded-full bg-yellow-500" />
              <Box className="w-3 h-3 rounded-full" style={{ backgroundColor: '#39FF14' }} />
              <Typography
                variant="caption"
                sx={{ ml: 2, color: '#B0B0B0', fontFamily: 'monospace' }}
              >
                terminal@cloud-sandbox
              </Typography>
            </Box>
            <IconButton size="small" onClick={clearTerminal}>
              <Trash2 className="w-4 h-4" style={{ color: '#666' }} />
            </IconButton>
          </Box>

          {/* Terminal Output */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              fontSize: '0.9rem',
              color: '#39FF14',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: '#0A0A0A',
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: '#39FF14',
                borderRadius: '4px',
              },
            }}
          >
            <Typography sx={{ color: '#666', mb: 2 }}>
              Welcome to Cloud Terminal v1.0.0
              <br />
              Type 'help' for available commands
              <br />
              ════════════════════════════════════════
            </Typography>

            {history.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography sx={{ color: '#39FF14' }}>
                  user@sandbox:~$ {item.command}
                </Typography>
                <Typography sx={{ color: '#FFF', whiteSpace: 'pre-wrap', ml: 2 }}>
                  {item.output}
                </Typography>
              </Box>
            ))}

            {loading && (
              <Typography sx={{ color: '#FFD700', animation: 'blink 1s infinite' }}>
                Processing...
              </Typography>
            )}

            <div ref={terminalEndRef} />
          </Box>

          {/* Terminal Input */}
          <Box sx={{ bgcolor: '#0A0A0A', p: 2, borderTop: '1px solid rgba(57, 255, 20, 0.2)' }}>
            <form onSubmit={handleSubmit}>
              <Box className="flex gap-2 items-center">
                <Typography sx={{ color: '#39FF14', fontFamily: 'monospace', minWidth: 'auto' }}>
                  user@sandbox:~$
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  disabled={loading}
                  autoFocus
                  placeholder="Enter command..."
                  InputProps={{
                    disableUnderline: true,
                    style: {
                      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                      color: '#39FF14',
                      fontSize: '0.9rem',
                    },
                  }}
                  sx={{
                    '& input::placeholder': {
                      color: '#666',
                      opacity: 1,
                    },
                  }}
                />
                <IconButton
                  type="submit"
                  disabled={loading || !command.trim()}
                  sx={{
                    color: '#39FF14',
                    '&:disabled': { color: '#333' },
                  }}
                >
                  <Send className="w-5 h-5" />
                </IconButton>
              </Box>
            </form>
          </Box>
        </Card>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1E1E1E',
            border: '1px solid rgba(57, 255, 20, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ color: '#39FF14' }}>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="First Name"
            defaultValue={user?.first_name}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Last Name"
            defaultValue={user?.last_name}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            defaultValue={user?.email}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProfileOpen(false)} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: '#39FF14', color: '#121212' }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars */}
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success" sx={{ bgcolor: '#1E1E1E', color: '#39FF14' }}>
          Task created successfully!
        </Alert>
      </Snackbar>

      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
