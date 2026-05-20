import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import { Save, FileEdit, Loader } from 'lucide-react';
import api from '../config/api';
import { NanoFile } from '../types';

export default function NanoEditor() {
  const [content, setContent] = useState('');
  const [filename, setFilename] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const response = await api.get<NanoFile>('/nano/');
      if (response.data) {
        setContent(response.data.content || '');
        setFilename(response.data.filename || 'untitled.txt');
      }
    } catch (err: any) {
      setError('Fayl yuklanmadi');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      await api.post<NanoFile>('/nano/save/', {
        content,
        filename,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Saqlashda xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box className="max-w-6xl mx-auto">
      <Box className="mb-4 flex items-center justify-between">
        <Box className="flex items-center gap-2">
          <FileEdit className="w-8 h-8 text-blue-600" />
          <Typography variant="h4" className="text-gray-800">
            Nano Editor
          </Typography>
        </Box>
      </Box>

      <Paper className="p-4 mb-4">
        <TextField
          fullWidth
          label="Fayl nomi"
          variant="outlined"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="myfile.txt"
          className="mb-4"
        />

        {loading ? (
          <Box className="flex items-center justify-center p-8">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
            <Typography className="ml-2">Yuklanmoqda...</Typography>
          </Box>
        ) : (
          <>
            <Paper
              variant="outlined"
              className="p-4 bg-slate-900 text-green-400 font-mono min-h-[500px]"
            >
              <Box className="mb-2 pb-2 border-b border-slate-700">
                <Typography variant="caption" className="text-gray-400">
                  GNU nano 6.2 - {filename || 'untitled.txt'}
                </Typography>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={20}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Matn kiriting..."
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  style: {
                    fontFamily: 'monospace',
                    color: '#4ade80',
                    fontSize: '14px',
                  },
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    color: '#4ade80',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: '#6b7280',
                    opacity: 1,
                  },
                }}
              />

              <Box className="mt-4 pt-2 border-t border-slate-700">
                <Typography variant="caption" className="text-gray-400">
                  ^G Yordam | ^O Saqlash | ^X Chiqish | Satrlar: {content.split('\n').length}
                </Typography>
              </Box>
            </Paper>

            <Box className="flex justify-end gap-2 mt-4">
              <Button
                variant="contained"
                color="primary"
                startIcon={saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                onClick={handleSave}
                disabled={saving || !filename.trim()}
                size="large"
              >
                {saving ? 'Saqlanmoqda...' : 'Saqlash (Ctrl+O)'}
              </Button>
            </Box>
          </>
        )}
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Fayl muvaffaqiyatli saqlandi!
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
