import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/Validators';

// MUI Imports (no changes)
import {
  Container, Box, Card, CardContent, Typography, TextField, Button,
  CircularProgress, FormControlLabel, Checkbox, Link, Alert, Stack
} from '@mui/material';

const LoginPage: React.FC = () => {
  // ✨ Get the global `error` and `clearError` from the context
  const { login, error: authError } = useAuth();
  const navigate = useNavigate(); // Still needed for other potential navigation
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ✨ Clear errors when the user starts typing again
    if (Object.keys(errors).length) setErrors({});
    
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
      // ✨ No need for navigate('/') here, as AuthContext handles it
    } catch (error) {
      // The error will now be set in the global AuthContext state,
      // and the component will re-render to display it.
      // We don't need a local error state for this.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card sx={{ width: '100%', p: 2 }}>
          <CardContent>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Sign in to your account
            </Typography>
            
            {/* ✨ Display the error message from the AuthContext */}
            {authError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {authError}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              {/* --- The rest of your JSX is perfect and needs no changes --- */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isLoading}
              />
              <TextField
                 margin="normal"
                 required
                 fullWidth
                 name="password"
                 label="Password"
                 type="password"
                 id="password"
                 value={formData.password}
                 onChange={handleChange}
                 error={!!errors.password}
                 helperText={errors.password}
                 disabled={isLoading}
              />
              {/* ... other elements ... */}
              <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ py: 1.5 }}>
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>
            {/* ... */}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginPage;