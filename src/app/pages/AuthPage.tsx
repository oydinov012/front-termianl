import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Terminal, Lock, User, Mail } from 'lucide-react';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeTab === 0) {
        // Login
        await login(username, password);
      } else {
        // Register
        if (!email) {
          setError('Email is required for registration');
          setLoading(false);
          return;
        }
        await register(username, email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        'Authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center p-4" sx={{ bgcolor: '#0A0A0A' }}>
      {/* Animated Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(57, 255, 20, 0.05) 0%, rgba(18, 18, 18, 0) 50%)',
          pointerEvents: 'none',
        }}
      />

      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          bgcolor: '#1E1E1E',
          boxShadow: '0 0 60px rgba(57, 255, 20, 0.15)',
          border: '1px solid rgba(57, 255, 20, 0.2)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box className="flex flex-col items-center mb-6">
            <Box className="mb-4 relative">
              <Terminal className="w-16 h-16" style={{ color: '#39FF14' }} />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 80,
                  height: 80,
                  border: '2px solid #39FF14',
                  borderRadius: '50%',
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 0.3, transform: 'translate(-50%, -50%) scale(1)' },
                    '50%': { opacity: 0.1, transform: 'translate(-50%, -50%) scale(1.2)' },
                  },
                }}
              />
            </Box>
            <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 1 }}>
              Cloud Terminal
            </Typography>
            <Typography variant="body2" sx={{ color: '#B0B0B0', textAlign: 'center' }}>
              Gamified Linux Learning Platform
            </Typography>
          </Box>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{
              mb: 3,
              '& .MuiTab-root': {
                color: '#B0B0B0',
                fontWeight: 600,
                '&.Mui-selected': {
                  color: '#39FF14',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#39FF14',
                height: 3,
                boxShadow: '0 0 10px rgba(57, 255, 20, 0.5)',
              },
            }}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Registration Info */}
          {activeTab === 1 && (
            <Alert
              severity="info"
              sx={{
                mb: 3,
                bgcolor: 'rgba(57, 255, 20, 0.05)',
                color: '#39FF14',
                border: '1px solid rgba(57, 255, 20, 0.2)',
                '& .MuiAlert-icon': {
                  color: '#39FF14',
                },
              }}
            >
              Upon registration, a secure personal root sandbox directory will be automatically
              provisioned for your account.
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Box className="space-y-4">
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                InputProps={{
                  startAdornment: <User className="w-5 h-5 mr-2" style={{ color: '#39FF14' }} />,
                  style: { fontFamily: 'monospace' },
                }}
              />

              {activeTab === 1 && (
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <Mail className="w-5 h-5 mr-2" style={{ color: '#39FF14' }} />,
                  }}
                />
              )}

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: <Lock className="w-5 h-5 mr-2" style={{ color: '#39FF14' }} />,
                  style: { fontFamily: 'monospace' },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  bgcolor: '#39FF14',
                  color: '#121212',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: '#2ECC11',
                  },
                  '&:disabled': {
                    bgcolor: '#2A2A2A',
                    color: '#666',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: '#121212' }} />
                ) : activeTab === 0 ? (
                  "Let's Hack"
                ) : (
                  'Enter Terminal'
                )}
              </Button>
            </Box>
          </form>

          {/* Footer */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 3,
              color: '#666',
              fontFamily: 'monospace',
            }}
          >
            &gt; sudo access granted_
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
