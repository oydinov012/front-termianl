import React, { useState, useRef, useEffect } from 'react';
import { Paper, TextField, Box, Typography, IconButton, Chip } from '@mui/material';
import { Send, Trash2, Info } from 'lucide-react';
import api from '../config/api';
import { TerminalResponse } from '../types';

interface CommandHistory {
  command: string;
  output: string;
  timestamp: Date;
}

export default function TerminalPage() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setLoading(true);
    const currentCommand = command;
    setCommand('');

    try {
      const response = await api.post<TerminalResponse>('/terminal/', {
        command: currentCommand,
      });

      setHistory((prev) => [
        ...prev,
        {
          command: currentCommand,
          output: response.data.output || response.data.result || 'Buyruq muvaffaqiyatli bajarildi',
          timestamp: new Date(),
        },
      ]);
    } catch (error: any) {
      setHistory((prev) => [
        ...prev,
        {
          command: currentCommand,
          output: error.response?.data?.error || 'Xatolik yuz berdi',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <Box className="max-w-6xl mx-auto">
      <Box className="mb-4 flex items-center justify-between">
        <Typography variant="h4" className="text-gray-800">
          Terminal
        </Typography>
        <Box className="flex gap-2">
          <Chip
            icon={<Info className="w-4 h-4" />}
            label="Linux buyruqlarini kiriting"
            color="primary"
            variant="outlined"
          />
          <IconButton onClick={clearHistory} color="error" title="Tarixni tozalash">
            <Trash2 className="w-5 h-5" />
          </IconButton>
        </Box>
      </Box>

      <Paper className="p-4 mb-4 min-h-[500px] max-h-[600px] overflow-y-auto bg-slate-900 text-green-400 font-mono">
        <Box className="mb-4">
          <Typography variant="body2" className="text-green-500">
            Linux Terminal Simulator - Buyruqlarni kiriting va natijani ko'ring
          </Typography>
          <Typography variant="body2" className="text-green-500">
            =====================================
          </Typography>
        </Box>

        {history.map((item, index) => (
          <Box key={index} className="mb-4">
            <Box className="flex items-start">
              <Typography className="text-blue-400 mr-2">$</Typography>
              <Typography className="text-white flex-1">{item.command}</Typography>
              <Typography variant="caption" className="text-gray-500">
                {item.timestamp.toLocaleTimeString()}
              </Typography>
            </Box>
            <Box className="ml-4 mt-1 whitespace-pre-wrap">
              <Typography className="text-green-400">{item.output}</Typography>
            </Box>
          </Box>
        ))}

        {loading && (
          <Box className="flex items-center">
            <Typography className="text-yellow-400 animate-pulse">
              Buyruq bajarilmoqda...
            </Typography>
          </Box>
        )}

        <div ref={terminalEndRef} />
      </Paper>

      <Paper className="p-4">
        <form onSubmit={handleSubmit}>
          <Box className="flex gap-2">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Linux buyrug'ini kiriting (masalan: ls, pwd, whoami)"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              disabled={loading}
              autoFocus
              className="font-mono"
            />
            <IconButton
              type="submit"
              color="primary"
              disabled={loading || !command.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Send className="w-5 h-5" />
            </IconButton>
          </Box>
        </form>

        <Box className="mt-4">
          <Typography variant="caption" className="text-gray-600">
            Maslahatlar: ls, pwd, whoami, echo "text", cat filename, mkdir dirname
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
