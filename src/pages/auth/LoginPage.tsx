import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateEmail } from '../../utils/Validators';
import {
  Container, Box, Typography, TextField, Button,
  CircularProgress, Link, Alert, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSnackbar } from '../../context/SnackbarContext';

const LoginPage: React.FC = () => {
  const { login, error: authError, clearError, loading, isAuthenticated } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => { clearError(); }, [clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    clearError();

    try {
      await login(formData.email, formData.password);
      showSnackbar('Logged in successfully!', 'success');
    } catch (error: any) {
      showSnackbar(error?.message || 'Login failed', 'error');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        minHeight: '100vh',
        background: 'radial-gradient(circle at top left, #0a0f1a 0%, #000 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* floating blue glow effects */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: { xs: '300px', md: '400px' },
          height: { xs: '300px', md: '400px' },
          background: 'radial-gradient(circle, rgba(0,115,255,0.35), transparent 70%)',
          filter: 'blur(100px)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: { xs: '300px', md: '400px' },
          height: { xs: '300px', md: '400px' },
          background: 'radial-gradient(circle, rgba(0,204,255,0.25), transparent 70%)',
          filter: 'blur(100px)',
          zIndex: 0,
        }}
      />

      {/* LEFT SIDE (branding) */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          p: { xs: 3, md: 5 },
          mb: { xs: 4, md: 0 },
          zIndex: 1,
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            letterSpacing: '-0.02em',
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' },
            background: 'linear-gradient(90deg, #00aaff, #007bff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          KloudPrompt
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#b0c4de',
            maxWidth: 420,
            lineHeight: 1.6,
          }}
        >
          The creative hub for sharing and enhancing prompts — sleek, simple, and smart.
        </Typography>
      </Box>

      {/* RIGHT SIDE (glass form) */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, md: 4 },
          zIndex: 2,
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              background: 'rgba(15, 25, 45, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,150,255,0.15)',
              borderRadius: 4,
              boxShadow: '0 0 40px rgba(0,80,255,0.2)',
              p: { xs: 3, md: 5 },
            }}
          >
            <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" align="center" sx={{ mb: 3, color: '#9db6d6' }}>
              Sign in to continue your journey
            </Typography>

            {authError && <Alert severity="error" sx={{ mb: 2 }}>{authError}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                required
                margin="normal"
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                InputLabelProps={{ style: { color: '#9db6d6' } }}
                InputProps={{
                  style: {
                    color: '#e6f1ff',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: 10,
                  },
                }}
              />

              <TextField
                fullWidth
                required
                margin="normal"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                InputLabelProps={{ style: { color: '#9db6d6' } }}
                InputProps={{
                  style: {
                    color: '#e6f1ff',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: 10,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: '#9db6d6' }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.3,
                  borderRadius: 10,
                  background: 'linear-gradient(90deg, #009dff, #005ce6)',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 0 15px rgba(0,120,255,0.5)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #00b3ff, #003db8)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>

              <Typography align="center" sx={{ mt: 3, color: '#9db6d6' }}>
                Don’t have an account?{' '}
                <Link component={RouterLink} to="/register" sx={{ color: '#00aaff', fontWeight: 500 }}>
                  Sign Up
                </Link>
              </Typography>

              <Typography align="center" sx={{ mt: 1 }}>
                <Link component={RouterLink} to="/forgotPassword" sx={{ color: '#00aaff' }}>
                  Forgot Password?
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPage;
