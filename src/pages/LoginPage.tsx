// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/Validators';
import {
  Container, Box, Card, CardContent, Typography, TextField, Button,
  CircularProgress, FormControlLabel, Checkbox, Link, Alert, Stack
} from '@mui/material';

const LoginPage: React.FC = () => {
  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Object.keys(errors).length) setErrors({});
    if (authError) clearError();
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#121212',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container component="main" maxWidth="xs">
        <Card sx={{
          bgcolor: '#1E1E1E',
          color: '#fff',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
              Sign in to your account
            </Typography>

            {authError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {authError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isLoading}
                variant="outlined"
                InputLabelProps={{ style: { color: '#ccc' } }}
                InputProps={{
                  style: { color: '#fff', backgroundColor: '#2A2A2A' }
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                disabled={isLoading}
                InputLabelProps={{ style: { color: '#ccc' } }}
                InputProps={{
                  style: { color: '#fff', backgroundColor: '#2A2A2A' }
                }}
              />

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1, mb: 2 }}>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                  disabled={isLoading}
                  sx={{ color: '#ccc' }}
                />
                <Link component={RouterLink} to="/forgot-password" variant="body2" sx={{ color: '#90caf9' }}>
                  Forgot password?
                </Link>
              </Stack>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  bgcolor: '#1976d2',
                  '&:hover': { bgcolor: '#1565c0' },
                  fontWeight: 'bold'
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>

            <Typography variant="body2" align="center" sx={{ mt: 3, color: '#ccc' }}>
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" variant="body2" sx={{ color: '#90caf9' }}>
                Register here
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
