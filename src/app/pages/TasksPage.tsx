import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import { Plus, CheckSquare, Square, Trash2, Loader } from 'lucide-react';
import api from '../config/api';
import { Task } from '../types';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/task/');
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else if (response.data.tasks) {
        setTasks(response.data.tasks);
      } else {
        setTasks([]);
      }
    } catch (err: any) {
      setError('Vazifalar yuklanmadi');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      setError('Vazifa nomini kiriting');
      return;
    }

    try {
      await api.post('/task/', newTask);
      setOpenDialog(false);
      setNewTask({ title: '', description: '' });
      loadTasks();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Vazifa yaratishda xatolik');
    }
  };

  const toggleTaskComplete = async (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      await api.patch(`/task/${taskId}/`, {
        completed: !task.completed,
      });
      loadTasks();
    } catch (err) {
      setError('Vazifa yangilanmadi');
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await api.delete(`/task/${taskId}/`);
      loadTasks();
    } catch (err) {
      setError('Vazifa o\'chirilmadi');
    }
  };

  return (
    <Box className="max-w-6xl mx-auto">
      <Box className="mb-4 flex items-center justify-between">
        <Typography variant="h4" className="text-gray-800">
          Vazifalar
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus className="w-4 h-4" />}
          onClick={() => setOpenDialog(true)}
        >
          Yangi vazifa
        </Button>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box className="flex items-center justify-center p-8">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <Typography className="ml-2">Yuklanmoqda...</Typography>
        </Box>
      ) : (
        <Box className="grid gap-4">
          {tasks.length === 0 ? (
            <Paper className="p-8 text-center">
              <Typography variant="h6" className="text-gray-500 mb-2">
                Vazifalar yo'q
              </Typography>
              <Typography variant="body2" className="text-gray-400">
                Yangi vazifa qo'shish uchun yuqoridagi tugmani bosing
              </Typography>
            </Paper>
          ) : (
            tasks.map((task) => (
              <Card key={task.id} className={task.completed ? 'bg-gray-50' : ''}>
                <CardContent>
                  <Box className="flex items-start justify-between">
                    <Box className="flex items-start gap-3 flex-1">
                      <IconButton
                        onClick={() => toggleTaskComplete(task.id)}
                        color={task.completed ? 'success' : 'default'}
                      >
                        {task.completed ? (
                          <CheckSquare className="w-6 h-6" />
                        ) : (
                          <Square className="w-6 h-6" />
                        )}
                      </IconButton>
                      <Box className="flex-1">
                        <Typography
                          variant="h6"
                          className={task.completed ? 'line-through text-gray-500' : 'text-gray-800'}
                        >
                          {task.title}
                        </Typography>
                        {task.description && (
                          <Typography
                            variant="body2"
                            className={task.completed ? 'text-gray-400' : 'text-gray-600'}
                          >
                            {task.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Box className="flex items-center gap-2">
                      {task.completed && (
                        <Chip label="Bajarildi" color="success" size="small" />
                      )}
                      <IconButton
                        onClick={() => deleteTask(task.id)}
                        color="error"
                        size="small"
                      >
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yangi vazifa yaratish</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Vazifa nomi"
            variant="outlined"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            margin="normal"
            autoFocus
            required
          />
          <TextField
            fullWidth
            label="Tavsif"
            variant="outlined"
            multiline
            rows={3}
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Bekor qilish</Button>
          <Button onClick={handleCreateTask} variant="contained" color="primary">
            Yaratish
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
