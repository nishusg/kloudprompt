// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, validateUsername } from '../utils/Validators';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Link,
  CircularProgress,
  Box
} from '@mui/material';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.valid) {
      newErrors.username = usernameValidation.message || '';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message || '';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : 'Registration failed'
      });
    } finally {
      setIsLoading(false);
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
        p: 2
      }}
    >
      <Container component="main" maxWidth="xs">
        <Card
          sx={{
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            color: '#fff',
            backdropFilter: 'blur(8px)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            p: 2
          }}
        >
          <CardContent>
            <Typography component="h1" variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
              Create your account
            </Typography>

            {errors.form && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.form}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Stack spacing={2}>
                <TextField
                  variant="filled"
                  InputProps={{ style: { color: '#fff', backgroundColor: '#1e1e1e' } }}
                  InputLabelProps={{ style: { color: '#bbb' } }}
                  id="username"
                  name="username"
                  label="Username"
                  required
                  fullWidth
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                />
                <TextField
                  variant="filled"
                  InputProps={{ style: { color: '#fff', backgroundColor: '#1e1e1e' } }}
                  InputLabelProps={{ style: { color: '#bbb' } }}
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  required
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  variant="filled"
                  InputProps={{ style: { color: '#fff', backgroundColor: '#1e1e1e' } }}
                  InputLabelProps={{ style: { color: '#bbb' } }}
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  required
                  fullWidth
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                />
                <TextField
                  variant="filled"
                  InputProps={{ style: { color: '#fff', backgroundColor: '#1e1e1e' } }}
                  InputLabelProps={{ style: { color: '#bbb' } }}
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  required
                  fullWidth
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    bgcolor: 'primary.main',
                    color: '#fff',
                    '&:hover': { bgcolor: 'primary.dark' },
                    py: 1.5,
                    fontWeight: 'bold'
                  }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" align="center" sx={{ mt: 2, color: '#bbb' }}>
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" variant="body2" sx={{ color: 'primary.light' }}>
                Sign in
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default RegisterPage;
