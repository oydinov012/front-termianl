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
  
  // 🔴 isAuthenticated holatini ham context'dan ajratib olamiz
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // ==========================================
  // 🔄 AVTOMATIK YO'NALTIRISH (Xavfsizlik sirti)
  // ==========================================
  // Agar foydalanuvchi muvaffaqiyatli login bo'lsa va `user` statusi yangilansa,
  // ushbu useEffect uni darhol asosiy sahifaga xavfsiz o'tkazib yuboradi.
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // ==========================================
  // 🚀 FORM SUBMIT JALAYONI
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setError('');
    setLoading(true);

    try {
      // 1. Tizimga kirish va profil ma'lumotlarini yuklashni kutish
      await login(username, password);
      
      // 2. Muvaffaqiyatli o'tgandan so'ng yo'naltirish
      navigate('/');
    } catch (err: any) {
      console.error("Login xatoligi:", err);
      setError(err.response?.data?.detail || 'Login muvaffaqiyatsiz. Iltimos, qayta urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Paper elevation={3} className="p-8 max-w-md w-full mx-4">
        
        {/* LOGO QISMI */}
        <Box className="flex items-center justify-center mb-6">
          <Terminal className="w-10 h-10 text-green-500 mr-2" />
          <Typography variant="h4" component="h1" className="font-bold text-gray-800">
            Linux CLI
          </Typography>
        </Box>

        <Typography variant="h5" className="mb-6 text-center text-gray-700">
          Tizimga kirish
        </Typography>

        {/* XATOLIK CHIQSAY KO'RSATISH */}
        {error && (
          <Alert severity="error" className="mb-4">
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
            className="mb-4"
            margin="normal"
            disabled={loading}
            autoComplete="username" // 👈 2-skrinshotdagi sariq DOM ogohlantirishini yo'qotadi
          />

          <TextField
            fullWidth
            label="Parol"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-4"
            margin="normal"
            disabled={loading}
            autoComplete="current-password" // 👈 Brauzer parolni eslab qolishi va warning chiqmasligi uchun
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            className="mt-4 mb-4"
            startIcon={loading ? <Loader className="w-4 h-4 animate-spin" /> : undefined}
          >
            {loading ? 'Yuklanmoqda...' : 'Kirish'}
          </Button>

          {/* RO'YXATDAN O'TISH LINKI */}
          <Typography variant="body2" className="text-center text-gray-600">
            Akkauntingiz yo'qmi?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Ro'yxatdan o'tish
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}