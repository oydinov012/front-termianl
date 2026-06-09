import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Paper, Typography, Box, Alert } from '@mui/material';
import { Terminal, Loader } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 🟢 AuthContext'dan kerakli holatlar va login funksiyasini olamiz
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // ==========================================
  // 🔄 AVTOMATIK YO'NALTIRISH (Xavfsizlik sirti)
  // ==========================================
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);




  // ==========================================
  // 🚀 FORM SUBMIT JARAYONI
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setError('');
    setLoading(true);

    try {
      // 1. AuthContext ichidagi login funksiyasini chaqiramiz (U backenddan token va profilni tortadi)
      await login(username, password);
      
      // 2. Muvaffaqiyatli o'tgandan so'ng asosiy sahifaga yo'naltirish
      navigate('/');
    } catch (err: any) {
      console.error("Login xatoligi:", err);
      // Backenddan kelgan aniq xatolik xabarini ko'rsatish, aks holda standart matn
      setError(err.response?.data?.detail || err.response?.data?.message || 'Foydalanuvchi nomi yoki parol xato!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Paper elevation={3} className="p-8 max-w-md w-full mx-4" sx={{ bgcolor: '#ffffff', borderRadius: 2 }}>
        
        {/* LOGO QISMI */}
        <Box className="flex items-center justify-center mb-6">
          <Terminal className="w-10 h-10 text-green-500 mr-2" />
          <Typography variant="h4" component="h1" className="font-bold text-gray-800" sx={{ fontWeight: 'bold' }}>
            Linux CLI
          </Typography>
        </Box>

        <Typography variant="h5" className="mb-6 text-center text-gray-700" sx={{ mb: 3 }}>
          Tizimga kirish
        </Typography>

        {/* XATOLIK STRUKTURASI */}
        {error && (
          <Alert severity="error" className="mb-4" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* FORM MAYDONI */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Foydalanuvchi nomi"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            margin="normal"
            disabled={loading}
            autoComplete="username" // 👈 Brauzer ogohlantirishini yo'qotadi
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Parol"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            disabled={loading}
            autoComplete="current-password" // 👈 Parolni eslab qolish xavfsizligi uchun
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            startIcon={loading ? <Loader className="w-4 h-4 animate-spin" /> : undefined}
            sx={{ py: 1.5, mb: 2, textTransform: 'none', fontSize: '1rem' }}
          >
            {loading ? 'Yuklanmoqda...' : 'Kirish'}
          </Button>

          {/* RO'YXATDAN O'TISH LINKI */}
          <Typography variant="body2" className="text-center text-gray-600" sx={{ mt: 2, textAlign: 'center' }}>
            Akkauntingiz yo'qmi?{' '}
            <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>
              Ro'yxatdan o'tish
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}