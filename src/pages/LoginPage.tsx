// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/Validators';
import {
  Container, Box, Card, CardContent, Typography, TextField, Button,
  CircularProgress, FormControlLabel, Checkbox, Link, Alert, Stack, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginPage: React.FC = () => {
  const { login, error: authError, clearError, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    if (authError) clearError(); // clear only if there was an auth error
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#121212',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container component="main" maxWidth="xs">
        <Card
          sx={{
            bgcolor: '#1E1E1E',
            color: '#fff',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              component="h1"
              variant="h5"
              align="center"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
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
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                disabled={loading}
                InputLabelProps={{ style: { color: '#ccc' } }}
                InputProps={{
                  style: { color: '#fff', backgroundColor: '#2A2A2A' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(prev => !prev)}
                        edge="end"
                        sx={{ color: '#ccc' }}
                        type="button"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 1, mb: 2 }}
              >
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label="Remember me"
                  disabled={loading}
                  sx={{ color: '#ccc' }}
                />
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  sx={{ color: '#90caf9' }}
                >
                  Forgot password?
                </Link>
              </Stack>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  bgcolor: '#1976d2',
                  '&:hover': { bgcolor: '#1565c0' },
                  fontWeight: 'bold'
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </Box>

            <Typography variant="body2" align="center" sx={{ mt: 3, color: '#ccc' }}>
              Don&apos;t have an account?{' '}
              <Link
                component={RouterLink}
                to="/register"
                variant="body2"
                sx={{ color: '#90caf9' }}
              >
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
