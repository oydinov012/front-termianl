import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Paper, Typography, Box, Alert } from '@mui/material';
import { Terminal, Loader } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login muvaffaqiyatsiz. Iltimos, qayta urinib ko\'ring.');
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
          Tizimga kirish
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
            label="Parol"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Yuklanmoqda...' : 'Kirish'}
          </Button>

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
