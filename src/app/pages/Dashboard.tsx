  //     -------figma------
// import React, { useState, useRef, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import {
//   Box,
//   Paper,
//   TextField,
//   Button,
//   Typography,
//   Avatar,
//   Menu,
//   MenuItem,
//   IconButton,
//   LinearProgress,
//   Card,
//   CardContent,
//   Divider,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Snackbar,
//   Alert,
//   Chip,
// } from '@mui/material';
// import {
//   Send,
//   Trash2,
//   LogOut,
//   User,
//   Flame,
//   XCircle,
//   CheckCircle2,
//   Play,
//   ChevronDown,
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import api from '../config/api';

// interface CommandHistory {
//   command: string;
//   output: string;
//   timestamp: Date;
// }

// interface UserStats {
//   level: number;
//   xp: number;
//   maxXp: number;
//   successStreak: number;
//   failedAttempts: number;
//   totalCompleted: number;
// }

// export default function Dashboard() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [command, setCommand] = useState('');
//   const [history, setHistory] = useState<CommandHistory[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [editProfileOpen, setEditProfileOpen] = useState(false);
//   const [taskTitle, setTaskTitle] = useState('');
//   const [taskDescription, setTaskDescription] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState('');
//   const terminalEndRef = useRef<HTMLDivElement>(null);

//   // Mock stats - replace with real API data
//   const [stats, setStats] = useState<UserStats>({
//     level: 5,
//     xp: 350,
//     maxXp: 500,
//     successStreak: 12,
//     failedAttempts: 3,
//     totalCompleted: 28,
//   });

//   useEffect(() => {
//     terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [history]);

//   const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleCloseMenu = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/auth');
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!command.trim()) return;

//     setLoading(true);
//     const currentCommand = command;
//     setCommand('');

//     try {
//       const response = await api.post('/terminal/', {
//         command: currentCommand,
//       });

//       setHistory((prev) => [
//         ...prev,
//         {
//           command: currentCommand,
//           output: response.data.output || response.data.result || 'Command executed successfully',
//           timestamp: new Date(),
//         },
//       ]);
//     } catch (error: any) {
//       setHistory((prev) => [
//         ...prev,
//         {
//           command: currentCommand,
//           output: error.response?.data?.error || 'Command failed',
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRunTask = async () => {
//     if (!taskTitle.trim()) {
//       setError('Task title is required');
//       return;
//     }

//     try {
//       await api.post('/task/', {
//         title: taskTitle,
//         description: taskDescription,
//       });
//       setSuccess(true);
//       setTaskTitle('');
//       setTaskDescription('');
//     } catch (err) {
//       setError('Failed to create task');
//     }
//   };

//   const clearTerminal = () => {
//     setHistory([]);
//   };

//   const getInitials = () => {
//     if (user?.first_name && user?.last_name) {
//       return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
//     }
//     return user?.username?.[0]?.toUpperCase() || 'U';
//   };

//   const xpPercentage = (stats.xp / stats.maxXp) * 100;

//   return (
//     <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0A0A0A' }}>
//       {/* Top Navbar */}
//       <Paper
//         elevation={0}
//         sx={{
//           bgcolor: '#121212',
//           borderBottom: '1px solid rgba(57, 255, 20, 0.2)',
//           px: 3,
//           py: 2,
//         }}
//       >
//         <Box className="flex items-center justify-between">
//           <Box className="flex items-center gap-4">
//             <IconButton onClick={handleMenu} sx={{ p: 0 }}>
//               <Avatar
//                 sx={{
//                   bgcolor: '#39FF14',
//                   color: '#121212',
//                   width: 48,
//                   height: 48,
//                   fontWeight: 700,
//                   border: '2px solid #39FF14',
//                   boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)',
//                 }}
//               >
//                 {getInitials()}
//               </Avatar>
//             </IconButton>

//             <Box>
//               <Box className="flex items-center gap-2">
//                 <Typography sx={{ color: '#FFF', fontWeight: 700, fontSize: '1.1rem' }}>
//                   {user?.username || 'User'}
//                 </Typography>
//                 <Chip
//                   label={`Level ${stats.level}`}
//                   size="small"
//                   sx={{
//                     bgcolor: 'rgba(57, 255, 20, 0.15)',
//                     color: '#39FF14',
//                     border: '1px solid #39FF14',
//                     fontWeight: 700,
//                   }}
//                 />
//               </Box>
//               <Box sx={{ width: 200, mt: 0.5 }}>
//                 <Box className="flex justify-between mb-1">
//                   <Typography variant="caption" sx={{ color: '#B0B0B0' }}>
//                     XP: {stats.xp}/{stats.maxXp}
//                   </Typography>
//                 </Box>
//                 <LinearProgress
//                   variant="determinate"
//                   value={xpPercentage}
//                   sx={{
//                     height: 6,
//                     borderRadius: 3,
//                     bgcolor: '#2A2A2A',
//                     '& .MuiLinearProgress-bar': {
//                       bgcolor: '#39FF14',
//                       boxShadow: '0 0 10px rgba(57, 255, 20, 0.5)',
//                     },
//                   }}
//                 />
//               </Box>
//             </Box>
//           </Box>

//           <ChevronDown className="w-5 h-5" style={{ color: '#39FF14' }} />
//         </Box>
//       </Paper>

//       {/* Profile Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleCloseMenu}
//         PaperProps={{
//           sx: {
//             bgcolor: '#1E1E1E',
//             border: '1px solid rgba(57, 255, 20, 0.2)',
//             mt: 1,
//           },
//         }}
//       >
//         <MenuItem onClick={() => { setEditProfileOpen(true); handleCloseMenu(); }}>
//           <User className="w-4 h-4 mr-2" style={{ color: '#39FF14' }} />
//           Edit Profile
//         </MenuItem>
//         <Divider sx={{ borderColor: '#2A2A2A' }} />
//         <MenuItem onClick={handleLogout} sx={{ color: '#FF4444' }}>
//           <LogOut className="w-4 h-4 mr-2" />
//           Logout
//         </MenuItem>
//       </Menu>

//       {/* Main Content */}
//       <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 2, p: 2 }}>
//         {/* Top-Left: Task Creation Panel */}
//         <Card
//           sx={{
//             bgcolor: '#1E1E1E',
//             border: '1px solid rgba(57, 255, 20, 0.2)',
//             boxShadow: '0 0 30px rgba(57, 255, 20, 0.1)',
//           }}
//         >
//           <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//             <Typography variant="h6" sx={{ color: '#39FF14', mb: 2, fontWeight: 700 }}>
//               Create Task
//             </Typography>
//             <TextField
//               fullWidth
//               label="Task Name"
//               value={taskTitle}
//               onChange={(e) => setTaskTitle(e.target.value)}
//               sx={{ mb: 2 }}
//               InputLabelProps={{ style: { fontFamily: 'monospace' } }}
//               inputProps={{ style: { fontFamily: 'monospace' } }}
//             />
//             <TextField
//               fullWidth
//               multiline
//               rows={4}
//               label="Description"
//               value={taskDescription}
//               onChange={(e) => setTaskDescription(e.target.value)}
//               sx={{ mb: 2, flex: 1 }}
//               InputLabelProps={{ style: { fontFamily: 'monospace' } }}
//               inputProps={{ style: { fontFamily: 'monospace' } }}
//             />
//             <Button
//               variant="contained"
//               endIcon={<Play className="w-4 h-4" />}
//               onClick={handleRunTask}
//               sx={{
//                 alignSelf: 'flex-end',
//                 bgcolor: '#39FF14',
//                 color: '#121212',
//                 fontWeight: 700,
//                 '&:hover': { bgcolor: '#2ECC11' },
//               }}
//             >
//               Run
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Top-Right: Profile Stats & Streaks */}
//         <Card
//           sx={{
//             bgcolor: '#1E1E1E',
//             border: '1px solid rgba(57, 255, 20, 0.2)',
//             boxShadow: '0 0 30px rgba(57, 255, 20, 0.1)',
//           }}
//         >
//           <CardContent>
//             <Typography variant="h6" sx={{ color: '#39FF14', mb: 3, fontWeight: 700 }}>
//               Statistics
//             </Typography>
//             <Box className="grid grid-cols-3 gap-3">
//               <Paper
//                 sx={{
//                   bgcolor: '#121212',
//                   p: 2,
//                   textAlign: 'center',
//                   border: '1px solid rgba(255, 140, 0, 0.3)',
//                 }}
//               >
//                 <Flame className="w-8 h-8 mx-auto mb-2" style={{ color: '#FF8C00' }} />
//                 <Typography variant="h4" sx={{ color: '#FF8C00', fontWeight: 700 }}>
//                   {stats.successStreak}
//                 </Typography>
//                 <Typography variant="caption" sx={{ color: '#B0B0B0' }}>
//                   Success Streak
//                 </Typography>
//               </Paper>

//               <Paper
//                 sx={{
//                   bgcolor: '#121212',
//                   p: 2,
//                   textAlign: 'center',
//                   border: '1px solid rgba(255, 68, 68, 0.3)',
//                 }}
//               >
//                 <XCircle className="w-8 h-8 mx-auto mb-2" style={{ color: '#FF4444' }} />
//                 <Typography variant="h4" sx={{ color: '#FF4444', fontWeight: 700 }}>
//                   {stats.failedAttempts}
//                 </Typography>
//                 <Typography variant="caption" sx={{ color: '#B0B0B0' }}>
//                   Failed Attempts
//                 </Typography>
//               </Paper>

//               <Paper
//                 sx={{
//                   bgcolor: '#121212',
//                   p: 2,
//                   textAlign: 'center',
//                   border: '1px solid rgba(57, 255, 20, 0.3)',
//                 }}
//               >
//                 <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: '#39FF14' }} />
//                 <Typography variant="h4" sx={{ color: '#39FF14', fontWeight: 700 }}>
//                   {stats.totalCompleted}
//                 </Typography>
//                 <Typography variant="caption" sx={{ color: '#B0B0B0' }}>
//                   Total Completed
//                 </Typography>
//               </Paper>
//             </Box>
//           </CardContent>
//         </Card>

//         {/* Bottom: Terminal Window */}
//         <Card
//           sx={{
//             gridColumn: '1 / -1',
//             bgcolor: '#000',
//             border: '1px solid rgba(57, 255, 20, 0.3)',
//             boxShadow: '0 0 40px rgba(57, 255, 20, 0.15)',
//             display: 'flex',
//             flexDirection: 'column',
//           }}
//         >
//           {/* Terminal Header */}
//           <Box
//             sx={{
//               bgcolor: '#1A1A1A',
//               px: 2,
//               py: 1,
//               borderBottom: '1px solid rgba(57, 255, 20, 0.2)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//             }}
//           >
//             <Box className="flex items-center gap-2">
//               <Box className="w-3 h-3 rounded-full bg-red-500" />
//               <Box className="w-3 h-3 rounded-full bg-yellow-500" />
//               <Box className="w-3 h-3 rounded-full" style={{ backgroundColor: '#39FF14' }} />
//               <Typography
//                 variant="caption"
//                 sx={{ ml: 2, color: '#B0B0B0', fontFamily: 'monospace' }}
//               >
//                 terminal@cloud-sandbox
//               </Typography>
//             </Box>
//             <IconButton size="small" onClick={clearTerminal}>
//               <Trash2 className="w-4 h-4" style={{ color: '#666' }} />
//             </IconButton>
//           </Box>

//           {/* Terminal Output */}
//           <Box
//             sx={{
//               flex: 1,
//               overflowY: 'auto',
//               p: 2,
//               fontFamily: '"JetBrains Mono", "Fira Code", monospace',
//               fontSize: '0.9rem',
//               color: '#39FF14',
//               '&::-webkit-scrollbar': {
//                 width: '8px',
//               },
//               '&::-webkit-scrollbar-track': {
//                 bgcolor: '#0A0A0A',
//               },
//               '&::-webkit-scrollbar-thumb': {
//                 bgcolor: '#39FF14',
//                 borderRadius: '4px',
//               },
//             }}
//           >
//             <Typography sx={{ color: '#666', mb: 2 }}>
//               Welcome to Cloud Terminal v1.0.0
//               <br />
//               Type 'help' for available commands
//               <br />
//               ════════════════════════════════════════
//             </Typography>

//             {history.map((item, index) => (
//               <Box key={index} sx={{ mb: 2 }}>
//                 <Typography sx={{ color: '#39FF14' }}>
//                   user@sandbox:~$ {item.command}
//                 </Typography>
//                 <Typography sx={{ color: '#FFF', whiteSpace: 'pre-wrap', ml: 2 }}>
//                   {item.output}
//                 </Typography>
//               </Box>
//             ))}

//             {loading && (
//               <Typography sx={{ color: '#FFD700', animation: 'blink 1s infinite' }}>
//                 Processing...
//               </Typography>
//             )}

//             <div ref={terminalEndRef} />
//           </Box>

//           {/* Terminal Input */}
//           <Box sx={{ bgcolor: '#0A0A0A', p: 2, borderTop: '1px solid rgba(57, 255, 20, 0.2)' }}>
//             <form onSubmit={handleSubmit}>
//               <Box className="flex gap-2 items-center">
//                 <Typography sx={{ color: '#39FF14', fontFamily: 'monospace', minWidth: 'auto' }}>
//                   user@sandbox:~$
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   variant="standard"
//                   value={command}
//                   onChange={(e) => setCommand(e.target.value)}
//                   disabled={loading}
//                   autoFocus
//                   placeholder="Enter command..."
//                   InputProps={{
//                     disableUnderline: true,
//                     style: {
//                       fontFamily: '"JetBrains Mono", "Fira Code", monospace',
//                       color: '#39FF14',
//                       fontSize: '0.9rem',
//                     },
//                   }}
//                   sx={{
//                     '& input::placeholder': {
//                       color: '#666',
//                       opacity: 1,
//                     },
//                   }}
//                 />
//                 <IconButton
//                   type="submit"
//                   disabled={loading || !command.trim()}
//                   sx={{
//                     color: '#39FF14',
//                     '&:disabled': { color: '#333' },
//                   }}
//                 >
//                   <Send className="w-5 h-5" />
//                 </IconButton>
//               </Box>
//             </form>
//           </Box>
//         </Card>
//       </Box>

//       {/* Edit Profile Dialog */}
//       <Dialog
//         open={editProfileOpen}
//         onClose={() => setEditProfileOpen(false)}
//         PaperProps={{
//           sx: {
//             bgcolor: '#1E1E1E',
//             border: '1px solid rgba(57, 255, 20, 0.2)',
//           },
//         }}
//       >
//         <DialogTitle sx={{ color: '#39FF14' }}>Edit Profile</DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth
//             label="First Name"
//             defaultValue={user?.first_name}
//             sx={{ mt: 2, mb: 2 }}
//           />
//           <TextField
//             fullWidth
//             label="Last Name"
//             defaultValue={user?.last_name}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             fullWidth
//             label="Email"
//             defaultValue={user?.email}
//             sx={{ mb: 2 }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setEditProfileOpen(false)} sx={{ color: '#666' }}>
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             sx={{ bgcolor: '#39FF14', color: '#121212' }}
//           >
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbars */}
//       <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
//         <Alert severity="success" sx={{ bgcolor: '#1E1E1E', color: '#39FF14' }}>
//           Task created successfully!
//         </Alert>
//       </Snackbar>

//       <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')}>
//         <Alert severity="error" onClose={() => setError('')}>
//           {error}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }



//      ------------gemini----------------
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  Terminal as TerminalIcon,
  FolderTree,
  Award,
} from 'lucide-react';
import api from '../config/api';

// 🟢 config ichidagi utils faylidan aqlli Tab funksiyasini import qilamiz
import { getSuggestionsFromStructure } from '../config/utils';

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

interface ActiveTask {
  task_id: number;
  title: string;
  description: string;
  level: number;
  xp: number;
  status: string;
  structure: Record<string, any>; // Backenddan keladigan Nested JSON iyerarxiyasi
  formatted_structure: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Terminal holatlari
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('~'); 

  // Profil menyusi va bildirishnomalar holati
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Refs
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Faol topshiriq va statistika holati
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);
  const [profileStats, setProfileStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    maxXp: 100,
    successStreak: 0,
    failedAttempts: 0,
    totalCompleted: 0,
  });

  // Terminal har safar yangilanganda pastga avtomatik skrol qilish
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Profil menyusini ochish/yopish
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // 🖥️ TAB TUGMASI BOSILGANDA AVTO-TO'LDIRISH (INTELLISENSE)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault(); // Brauzer fokusni boshqa elementga o'tkazib yubormasligi uchun

      const inputVal = command.trim();
      if (!inputVal) return;

      const words = inputVal.split(' ');
      const lastWord = words[words.length - 1].toLowerCase();

      // Standart Linux va tizim buyruqlari
      const baseCommands = ['start', 'check', 'status', 'ls', 'cd', 'clear', 'mkdir', 'touch'];
      
      // Utils faylidan kelgan funksiya orqali joriy papkaga tegishli dinamik fayl/papkalar ro'yxati
      const dynamicFiles = activeTask ? getSuggestionsFromStructure(activeTask.structure, currentDirectory) : [];
      
      // 'start ' yozilganda joriy task ID sini ham variant qilib qo'shamiz
      if (words[0] === 'start' && activeTask) {
        dynamicFiles.push(String(activeTask.task_id));
      }

      const allSuggestions = [...baseCommands, ...dynamicFiles];
      const matches = allSuggestions.filter(item => item.toLowerCase().startsWith(lastWord));

      if (matches.length === 1) {
        // Bittagina moslik topilsa, oxirgi so'zni to'liq almashtiramiz
        words[words.length - 1] = matches[0];
        setCommand(words.join(' ') + (baseCommands.includes(matches[0]) ? ' ' : ''));
      } else if (matches.length > 1) {
        // Bir nechta variant bo'lsa, ularni konsol tarixiga chiqaramiz
        setHistory((prev) => [
          ...prev,
          {
            command: inputVal,
            output: `Variantlar: ${matches.join(', ')}`,
            timestamp: new Date()
          }
        ]);
      }
    }
  };

  // Backend javoblarini (Celery outputlarini) terminal uchun formatlash
  const formatOutput = (data: any): string => {
    if (!data) return 'Command executed.';
    if (typeof data === 'string') return data;
    if (typeof data === 'object') {
      if (data.result && data.result.output) return data.result.output;
      return data.output || data.message || JSON.stringify(data, null, 2);
    }
    return String(data);
  };

  // 🚀 TERMINAL BUYRUQLARINI BACKENDGA YUBORISH
  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || loading) return;

    const currentCommand = command.trim();
    setCommand('');
    setLoading(true);

    // Terminalni tozalash ichki buyrug'i
    if (currentCommand.toLowerCase() === 'clear') {
      setHistory([]);
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/terminal/', { command: currentCommand });
      const responseData = res.data;

      // 1. Prompt yo'lagini backend qaytargan real path bilan yangilaymiz
      if (responseData.current_path) {
        setCurrentDirectory(responseData.current_path);
      }

      // 2. Agar 'check' buyrug'i muvaffaqiyatli bo'lsa, profilingizni yangilaymiz
      if (currentCommand.toLowerCase() === 'check' && responseData.result?.status?.includes('correct')) {
        setSuccessMessage('Topshiriq muvaffaqiyatli yakunlandi! 🌲');
        setSuccess(true);
        setActiveTask(null); // Panelni tozalash
        setCurrentDirectory('~'); // Asosiy directoryga qaytarish

        // Agar backend yangi daraja va XP qaytargan bo'lsa, statni yangilaymiz
        if (responseData.xp && responseData.level) {
          setProfileStats(prev => ({
            ...prev,
            xp: responseData.xp,
            level: responseData.level,
            totalCompleted: prev.totalCompleted + 1,
            successStreak: prev.successStreak + 1
          }));
        }
      }

      setHistory((prev) => [
        ...prev,
        {
          command: currentCommand,
          output: formatOutput(responseData),
          timestamp: new Date(),
        },
      ]);

    } catch (err: any) {
      setHistory((prev) => [
        ...prev,
        {
          command: currentCommand,
          output: formatOutput(err.response?.data || 'Buyruqni bajarishda xatolik yuz berdi.'),
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 📡 TUGMA ORQALI YANGI TOPSHIRIQNI GENERATSIYA QILISH (GET /task/)
  const handleGetTask = async () => {
    setLoading(true);
    try {
      const res = await api.get('/task/');
      if (res.data) {
        setActiveTask({
          task_id: res.data.task_id,
          title: res.data.title,
          description: res.data.description,
          level: res.data.level,
          xp: res.data.xp,
          status: res.data.status,
          structure: res.data.structure, // Nested JSON obyekt saqlandi
          formatted_structure: res.data.formatted_structure,
        });

        setHistory((prev) => [
          ...prev,
          {
            command: `system --load-task id=${res.data.task_id}`,
            output: `📡 YANGI TOPSHIRIQ YUKLANDI:\n🆔 ID: ${res.data.task_id}\n🎯 Nomi: ${res.data.title}\n\n⚙️ Boshlash uchun terminalga yozing:\n👉 start ${res.data.task_id}`,
            timestamp: new Date(),
          },
        ]);
        setSuccessMessage('Yangi topshiriq olindi! Uni terminalda boshlang.');
        setSuccess(true);
      }
    } catch (err) {
      setError("Topshiriqni yuklashda xatolik yuz berdi yoki faol topshiriq mavjud.");
    } finally {
      setLoading(false);
    }
  };

  const clearTerminal = () => setHistory([]);
  const getInitials = () => (user?.first_name && user?.last_name) ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : (user?.username?.[0]?.toUpperCase() || 'U');

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0A0A0A' }}>
      {/* Top Navbar */}
      <Paper elevation={0} sx={{ bgcolor: '#121212', borderBottom: '1px solid rgba(57, 255, 20, 0.2)', px: 3, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: '#39FF14', color: '#121212', width: 48, height: 48, fontWeight: 700, border: '2px solid #39FF14', boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)' }}>
                {getInitials()}
              </Avatar>
            </IconButton>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ color: '#FFF', fontWeight: 700, fontSize: '1.1rem' }}>{user?.username || 'User'}</Typography>
                <Chip label={`Level ${profileStats.level}`} size="small" sx={{ bgcolor: 'rgba(57, 255, 20, 0.15)', color: '#39FF14', border: '1px solid #39FF14', fontWeight: 700 }} />
              </Box>
              <Box sx={{ width: 200, mt: 0.5 }}>
                <LinearProgress variant="determinate" value={(profileStats.xp / profileStats.maxXp) * 100} sx={{ height: 6, borderRadius: 3, bgcolor: '#2A2A2A', '& .MuiLinearProgress-bar': { bgcolor: '#39FF14' } }} />
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ color: '#B0B0B0', mr: 1, variant: 'body2', fontFamily: 'monospace' }}>Sozlamalar</Typography>
            <IconButton onClick={handleMenu} sx={{ color: '#39FF14' }}><ChevronDown className="w-5 h-5" /></IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu} PaperProps={{ sx: { bgcolor: '#121212', border: '1px solid rgba(57, 255, 20, 0.2)', color: '#FFF' } }}>
              <MenuItem onClick={handleCloseMenu} sx={{ gap: 1 }}><User className="w-4 h-4" /> Profil</MenuItem>
              <MenuItem onClick={handleLogout} sx={{ gap: 1, color: '#FF4444' }}><LogOut className="w-4 h-4" /> Chiqish</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Paper>

      {/* Main Content Grid Area */}
      <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 2, p: 2, overflow: 'hidden' }}>
        
        {/* TOP-LEFT PANEL: ACTIVE TASK DETAIL */}
        <Card sx={{ bgcolor: '#1E1E1E', border: '1px solid rgba(57, 255, 20, 0.2)', boxShadow: '0 0 30px rgba(57, 255, 20, 0.1)', overflowY: 'auto' }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {activeTask ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#39FF14', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TerminalIcon className="w-5 h-5" /> Topshiriq #{activeTask.task_id}
                  </Typography>
                  <Chip label={`Level ${activeTask.level}`} size="small" sx={{ bgcolor: 'rgba(255, 215, 0, 0.15)', color: '#FFD700', border: '1px solid #FFD700', fontWeight: 600 }} />
                </Box>

                <Typography variant="subtitle1" sx={{ color: '#FFF', fontWeight: 600, fontFamily: 'monospace' }}>{activeTask.title}</Typography>
                <Typography variant="body2" sx={{ color: '#B0B0B0', bgcolor: '#121212', p: 1.5, borderRadius: 1, borderLeft: '3px solid #39FF14', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{activeTask.description}</Typography>

                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ color: '#666', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <FolderTree className="w-4 h-4" /> Kutilayotgan iyerarxiya strukturasi:
                  </Typography>
                  <Typography sx={{ fontFamily: 'monospace', color: '#FFD700', pl: 1, fontSize: '0.85rem', whiteSpace: 'pre-wrap', bgcolor: '#0A0A0A', p: 1.5, borderRadius: 1, border: '1px dashed rgba(255, 215, 0, 0.2)' }}>
                    {activeTask.formatted_structure}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mt: 'auto', alignItems: 'center', pt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#39FF14' }}>
                    <Award className="w-4 h-4" />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>+{activeTask.xp} XP mukofot</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#888', ml: 'auto', fontFamily: 'monospace' }}>
                    Terminalda 'start {activeTask.task_id}' buyrug'ini bering.
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', gap: 2 }}>
                <Typography variant="h6" sx={{ color: '#666', fontFamily: 'monospace', textAlign: 'center' }}>Sizda faol topshiriq mavjud emas.<br />Tugmani bosib yangi loyihani yuklang.</Typography>
                <Button variant="contained" endIcon={<Play className="w-4 h-4" />} onClick={handleGetTask} disabled={loading} sx={{ bgcolor: '#39FF14', color: '#121212', fontWeight: 700, px: 4, py: 1.5, '&:hover': { bgcolor: '#2ECC11' }, boxShadow: '0 0 15px rgba(57, 255, 20, 0.4)' }}>
                  {loading ? 'Yuklanmoqda...' : 'Yangi Task Run Qilish'}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* TOP-RIGHT PANEL: STATISTICS */}
        <Card sx={{ bgcolor: '#1E1E1E', border: '1px solid rgba(57, 255, 20, 0.2)' }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ color: '#39FF14', mb: 3, fontWeight: 700 }}>Foydalanuvchi Ko'rsatkichlari</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, flex: 1, alignItems: 'center' }}>
              <Paper sx={{ bgcolor: '#121212', p: 3, textAlign: 'center', border: '1px solid rgba(255, 140, 0, 0.3)', boxShadow: '0 0 15px rgba(255, 140, 0, 0.05)' }}><Flame className="w-8 h-8 mx-auto mb-2" style={{ color: '#FF8000' }} /><Typography variant="h4" sx={{ color: '#FF8000', fontWeight: 700 }}>{profileStats.successStreak}</Typography><Typography variant="caption" sx={{ color: '#B0B0B0' }}>Aktiv Streak</Typography></Paper>
              <Paper sx={{ bgcolor: '#121212', p: 3, textAlign: 'center', border: '1px solid rgba(255, 68, 68, 0.3)', boxShadow: '0 0 15px rgba(255, 68, 68, 0.05)' }}><XCircle className="w-8 h-8 mx-auto mb-2" style={{ color: '#FF4444' }} /><Typography variant="h4" sx={{ color: '#FF4444', fontWeight: 700 }}>{profileStats.failedAttempts}</Typography><Typography variant="caption" sx={{ color: '#B0B0B0' }}>Xatolar</Typography></Paper>
              <Paper sx={{ bgcolor: '#121212', p: 3, textAlign: 'center', border: '1px solid rgba(57, 255, 20, 0.3)', boxShadow: '0 0 15px rgba(57, 255, 20, 0.05)' }}><CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: '#39FF14' }} /><Typography variant="h4" sx={{ color: '#39FF14', fontWeight: 700 }}>{profileStats.totalCompleted}</Typography><Typography variant="caption" sx={{ color: '#B0B0B0' }}>Bajarildi</Typography></Paper>
            </Box>
          </CardContent>
        </Card>

        {/* BOTTOM PANEL: FULL TERMINAL WINDOW */}
        <Card sx={{ gridColumn: '1 / -1', bgcolor: '#000', border: '1px solid rgba(57, 255, 20, 0.3)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Terminal header */}
          <Box sx={{ bgcolor: '#1A1A1A', px: 2, py: 1, borderBottom: '1px solid rgba(57, 255, 20, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef4444' }} />
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#eab308' }} />
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#39FF14' }} />
              <Typography variant="caption" sx={{ ml: 2, color: '#B0B0B0', fontFamily: 'monospace' }}>sandbox-terminal@linux-engine</Typography>
            </Box>
            <IconButton size="small" onClick={clearTerminal} title="Terminalni tozalash"><Trash2 className="w-4 h-4" style={{ color: '#666' }} /></IconButton>
          </Box>

          {/* Terminal output stream */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.88rem', color: '#39FF14', bgcolor: '#000' }}>
            <Typography sx={{ color: '#666', mb: 2, lineHeight: 1.5 }}>Welcome to Cloud Sandbox v1.2.5 (Celery Engine Active)<br />Tip: Papka va fayl nomlarini tezkor yozish uchun istalgan payt [Tab] bosing.<br />══════════════════════════════════════════════════════════</Typography>
            {history.map((item, index) => (
              <Box key={index} sx={{ mb: 1.5 }}>
                <Typography sx={{ color: '#39FF14', fontWeight: 600 }}>user@sandbox:{currentDirectory}$ {item.command}</Typography>
                <Typography sx={{ color: '#FFF', whiteSpace: 'pre-wrap', ml: 2, mt: 0.5, fontFamily: '"JetBrains Mono", monospace' }}>{item.output}</Typography>
              </Box>
            ))}
            <div ref={terminalEndRef} />
          </Box>

          {/* Terminal interactive prompt input */}
          <Box sx={{ bgcolor: '#0A0A0A', p: 2, borderTop: '1px solid rgba(57, 255, 20, 0.2)' }}>
            <form onSubmit={handleCommandSubmit}>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Typography sx={{ color: '#39FF14', fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  user@sandbox:{currentDirectory}$
                </Typography>
                <TextField 
                  fullWidth 
                  variant="standard" 
                  value={command} 
                  inputRef={inputRef}
                  onChange={(e) => setCommand(e.target.value)} 
                  onKeyDown={handleKeyDown} 
                  disabled={loading} 
                  placeholder="Buyruqlarni kiriting (masalan: start 36, cd project, mkdir, touch)..." 
                  InputProps={{ disableUnderline: true, style: { fontFamily: '"JetBrains Mono", monospace', color: '#39FF14', fontSize: '0.88rem' } }} 
                  autoComplete="off"
                />
                <IconButton type="submit" disabled={loading || !command.trim()} sx={{ color: '#39FF14' }}><Send className="w-5 h-5" /></IconButton>
              </Box>
            </form>
          </Box>
        </Card>
      </Box>

      {/* Global bildirishnomalar (Toast/Snackbar) */}
      <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" sx={{ bgcolor: '#121212', color: '#39FF14', border: '1px solid #39FF14', fontWeight: 600 }}>{successMessage}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="error" sx={{ bgcolor: '#121212', color: '#FF4444', border: '1px solid #FF4444' }}>{error}</Alert>
      </Snackbar>
    </Box>
  );
}
//             --------------  chatJTP----------

// import React, { useState, useRef, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import {
//   Box,
//   Paper,
//   TextField,
//   Typography,
//   Avatar,
//   Menu,
//   MenuItem,
//   IconButton,
//   LinearProgress,
//   Card,
//   CardContent,
//   Divider,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Snackbar,
//   Alert,
//   Chip,
//   Button,
// } from '@mui/material';

// import {
//   Send,
//   Trash2,
//   LogOut,
//   User,
//   Flame,
//   XCircle,
//   CheckCircle2,
//   Play,
//   ChevronDown,
// } from 'lucide-react';

// import { useNavigate } from 'react-router-dom';
// import api from '../config/api';

// interface CommandHistory {
//   command: string;
//   output: string;
// }

// interface UserStats {
//   level: number;
//   xp: number;
//   maxXp: number;
//   successStreak: number;
//   failedAttempts: number;
//   totalCompleted: number;
// }

// export default function Dashboard() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [command, setCommand] = useState('');
//   const [history, setHistory] = useState<CommandHistory[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [editProfileOpen, setEditProfileOpen] = useState(false);

//   const [taskTitle, setTaskTitle] = useState('');
//   const [taskDescription, setTaskDescription] = useState('');

//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState('');

//   const terminalEndRef = useRef<HTMLDivElement>(null);

//   const [stats] = useState<UserStats>({
//     level: 5,
//     xp: 350,
//     maxXp: 500,
//     successStreak: 12,
//     failedAttempts: 3,
//     totalCompleted: 28,
//   });

//   useEffect(() => {
//     terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [history]);

//   // -----------------------------
//   // SAFE OUTPUT FORMATTER 🔥
//   // -----------------------------
//   const formatOutput = (data: any): string => {
//     if (!data) return 'Empty response';

//     if (typeof data === 'string') return data;

//     if (typeof data === 'number') return String(data);

//     if (typeof data === 'object') {
//       return (
//         data.output ||
//         data.result?.output ||
//         data.message ||
//         JSON.stringify(data, null, 2)
//       );
//     }

//     return String(data);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!command.trim()) return;

//     const currentCommand = command;
//     setCommand('');
//     setLoading(true);

//     try {
//       const res = await api.post('/terminal/', {
//         command: currentCommand,
//       });

//       setHistory((prev) => [
//         ...prev,
//         {
//           command: currentCommand,
//           output: formatOutput(res.data),
//         },
//       ]);
//     } catch (err: any) {
//       setHistory((prev) => [
//         ...prev,
//         {
//           command: currentCommand,
//           output: formatOutput(err.response?.data || 'Error'),
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRunTask = async () => {
//     try {
//       await api.post('/task/', {
//         title: taskTitle,
//         description: taskDescription,
//       });

//       setSuccess(true);
//       setTaskTitle('');
//       setTaskDescription('');
//     } catch {
//       setError('Failed to create task');
//     }
//   };

//   const clearTerminal = () => setHistory([]);

//   const getInitials = () => {
//     if (user?.first_name && user?.last_name) {
//       return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
//     }
//     return user?.username?.[0]?.toUpperCase() || 'U';
//   };

//   const xpPercentage = (stats.xp / stats.maxXp) * 100;

//   return (
//     <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0A0A0A' }}>

//       {/* HEADER */}
//       <Paper sx={{ bgcolor: '#121212', p: 2 }}>
//         <Box display="flex" justifyContent="space-between">

//           <Box display="flex" gap={2} alignItems="center">
//             <Avatar sx={{ bgcolor: '#39FF14' }}>
//               {getInitials()}
//             </Avatar>

//             <Box>
//               <Typography color="white">{user?.username}</Typography>

//               <Chip
//                 label={`Level ${stats.level}`}
//                 size="small"
//                 sx={{ color: '#39FF14' }}
//               />

//               <LinearProgress
//                 variant="determinate"
//                 value={xpPercentage}
//                 sx={{ width: 200 }}
//               />
//             </Box>
//           </Box>

//         </Box>
//       </Paper>

//       {/* MAIN */}
//       <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>

//         {/* TERMINAL */}
//         <Card sx={{ flex: 1, bgcolor: '#000', overflow: 'hidden' }}>
//           <CardContent sx={{ height: '100%', overflowY: 'auto' }}>

//             <Typography sx={{ color: '#666' }}>
//               Cloud Terminal Ready...
//             </Typography>

//             {history.map((item, i) => (
//               <Box key={i} mb={2}>
//                 <Typography sx={{ color: '#39FF14' }}>
//                   $ {item.command}
//                 </Typography>

//                 <Typography sx={{ color: '#fff', whiteSpace: 'pre-wrap' }}>
//                   {item.output}
//                 </Typography>
//               </Box>
//             ))}

//             {loading && (
//               <Typography color="yellow">
//                 Processing...
//               </Typography>
//             )}

//             <div ref={terminalEndRef} />
//           </CardContent>

//           {/* INPUT */}
//           <Box sx={{ display: 'flex', p: 2, gap: 1 }}>
//             <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
//               <TextField
//                 fullWidth
//                 value={command}
//                 onChange={(e) => setCommand(e.target.value)}
//                 placeholder="Enter command..."
//               />

//               <IconButton type="submit">
//                 <Send />
//               </IconButton>
//             </form>

//             <IconButton onClick={clearTerminal}>
//               <Trash2 />
//             </IconButton>
//           </Box>
//         </Card>

//       </Box>

//       {/* SNACKBARS */}
//       <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
//         <Alert severity="success">Task created</Alert>
//       </Snackbar>

//       <Snackbar open={!!error} autoHideDuration={2000} onClose={() => setError('')}>
//         <Alert severity="error">{error}</Alert>
//       </Snackbar>

//     </Box>
//   );
// }