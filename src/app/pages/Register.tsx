import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Paper, Typography, Box, Alert } from '@mui/material';
import { Terminal, Loader } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Parollar mos kelmayapti');
      return;
    }

    if (password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    setLoading(true);

    try {
      await register(username, email, password);
      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.detail ||
        'Ro\'yxatdan o\'tish muvaffaqiyatsiz. Iltimos, qayta urinib ko\'ring.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Paper elevation={3} className="p-8 max-w-md w-full mx-4">
        <Box className="flex items-center justify-center mb-6">
          <Terminal className="w-10 h-10 text-green-500 mr-2" />
          <Typography variant="h4" component="h1" className="font-bold text-gray-800">
            Linux CLI
          </Typography>
        </Box>

        <Typography variant="h5" className="mb-6 text-center text-gray-700">
          Ro'yxatdan o'tish
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

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
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-4"
            margin="normal"
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
          />

          <TextField
            fullWidth
            label="Parolni tasdiqlang"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mb-4"
            margin="normal"
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
            {loading ? 'Yuklanmoqda...' : 'Ro\'yxatdan o\'tish'}
          </Button>

          <Typography variant="body2" className="text-center text-gray-600">
            Akkauntingiz bormi?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Kirish
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}
