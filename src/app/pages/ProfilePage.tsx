import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Alert,
  Snackbar,
} from '@mui/material';
import { User as UserIcon, Save, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import { User } from '../types';

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      if (user) {
        await api.put<User>(`/api/profile1/1/`, {
          ...formData,
          password: user.username,
        });
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Profilni yangilashda xatolik');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    if (formData.first_name && formData.last_name) {
      return `${formData.first_name[0]}${formData.last_name[0]}`.toUpperCase();
    }
    return formData.username[0]?.toUpperCase() || 'U';
  };

  return (
    <Box className="max-w-4xl mx-auto">
      <Typography variant="h4" className="text-gray-800 mb-6">
        Profil
      </Typography>

      <Paper className="p-6">
        <Box className="flex items-center gap-6 mb-6">
          <Avatar
            sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '2rem' }}
          >
            {getInitials()}
          </Avatar>
          <Box>
            <Typography variant="h5" className="text-gray-800">
              {formData.first_name && formData.last_name
                ? `${formData.first_name} ${formData.last_name}`
                : formData.username}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              {formData.email}
            </Typography>
          </Box>
        </Box>

        <Box className="grid gap-4">
          <TextField
            fullWidth
            label="Foydalanuvchi nomi"
            variant="outlined"
            value={formData.username}
            disabled
            helperText="Foydalanuvchi nomini o'zgartirib bo'lmaydi"
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Box className="grid grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Ism"
              variant="outlined"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />

            <TextField
              fullWidth
              label="Familiya"
              variant="outlined"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
          </Box>

          <Box className="flex justify-end mt-4">
            <Button
              variant="contained"
              color="primary"
              startIcon={saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              onClick={handleSave}
              disabled={saving}
              size="large"
            >
              {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Profil muvaffaqiyatli yangilandi!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
