import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateEmail } from '../../utils/Validators';
import {
  Container, Box, Card, CardContent, Typography, TextField, Button,
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

  // redirect if logged in
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
    if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address';
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
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Container component="main" maxWidth="xs">
        <Card sx={{ bgcolor: '#121212', color: '#fff', borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
              Sign in to your account
            </Typography>

            {authError && <Alert severity="error" sx={{ mb: 2 }}>{authError}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                type="email"
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                disabled={loading}
                variant="outlined"
                InputProps={{ style: { color: '#fff', backgroundColor: '#121212' } }}
                InputLabelProps={{ style: { color: '#bbb' } }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                disabled={loading}
                InputLabelProps={{ style: { color: '#bbb' } }}
                InputProps={{
                  style: { color: '#fff', backgroundColor: '#121212' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(prev => !prev)} edge="end" sx={{ color: '#ccc' }} type="button">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button type="submit" fullWidth variant="contained" disabled={loading}
                sx={{ py: 1.5, bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' }, fontWeight: 'bold', mt: 2 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>

            <Typography variant="body2" align="center" sx={{ mt: 3, color: '#ccc' }}>
              Don&apos;t have an account?{' '}
              <Link component={RouterLink} to="/register" variant="body2" sx={{ color: '#90caf9' }}>Register here</Link>
            </Typography>

            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              <Link component={RouterLink} to="/forgotPassword" variant="body2" sx={{ color: '#90caf9' }}>Forgot password?</Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
