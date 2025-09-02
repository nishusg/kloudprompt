import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword, validateUsername } from '../../utils/Validators';
import {
  Container, Card, CardContent, Typography, TextField, Button,
  CircularProgress, Box
} from '@mui/material';
import { useSnackbar } from '../../context/SnackbarContext';
import { requestOtp, verifyOtp } from '../../services/OtpService';
import { OTPPurpose } from '../../utils/Enum';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Input states
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Live validation
  const handleUserNameChange = (value: string) => {
    setUserName(value);
    const validation = validateUsername(value);
    setErrors(prev => ({ ...prev, userName: validation.valid ? '' : validation.message || '' }));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setErrors(prev => ({ ...prev, email: validateEmail(value) ? '' : 'Please enter a valid email' }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const validation = validatePassword(value);
    setErrors(prev => ({
      ...prev,
      password: validation.valid ? '' : validation.message || '',
      confirmPassword: confirmPassword === value ? '' : 'Passwords do not match'
    }));
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setErrors(prev => ({ ...prev, confirmPassword: password === value ? '' : 'Passwords do not match' }));
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setErrors(prev => ({ ...prev, otp: value.trim() ? '' : 'OTP is required' }));
  };

  // Stepper-like Next handler
  const handleNext = async () => {
    setLoading(true);
    try {
      if (step === 0) {
        // Prevent next if live validation errors
        if (errors.userName || errors.email || errors.password || errors.confirmPassword) return;

        setStep(1);
        
        const res = await register(userName, email, password);
        if (res) {
          await requestOtp(email, OTPPurpose.Register);
          showSnackbar('OTP sent to your email!', 'success');
        }
      } else if (step === 1) {
        if (!otp.trim()) {
          setErrors(prev => ({ ...prev, otp: 'OTP is required' }));
          return;
        }

        await verifyOtp(email, otp, OTPPurpose.Register);
        showSnackbar('Registration successful!', 'success');
        await login(email, password);
      }
    } catch (error: any) {
      showSnackbar(error instanceof Error ? error.message : 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Container component="main" maxWidth="xs">
        <Card sx={{ bgcolor: '#1E1E1E', color: '#fff', borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
              {step === 0 ? 'Create Your Account' : 'Verify OTP'}
            </Typography>

            {/* Step 0 – Account Details */}
            {step === 0 && (
              <>
                <TextField
                  margin="normal"
                  InputProps={{ style: { color: '#fff', backgroundColor: '#1e1e1e' } }}
                  InputLabelProps={{ style: { color: '#bbb' } }}
                  required
                  fullWidth
                  id="userName"
                  label="Username"
                  value={userName}
                  onChange={e => handleUserNameChange(e.target.value)}
                  disabled={loading}
                  error={!!errors.userName}
                  helperText={errors.userName}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={e => handleEmailChange(e.target.value)}
                  disabled={loading}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{ style: { color: '#fff', backgroundColor: '#1e1e1e' } }}
                  InputLabelProps={{ style: { color: '#bbb' } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={e => handlePasswordChange(e.target.value)}
                  disabled={loading}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{ style: { color: '#fff', backgroundColor: '#1e1e1e' } }}
                  InputLabelProps={{ style: { color: '#bbb' } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => handleConfirmPasswordChange(e.target.value)}
                  disabled={loading}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{ style: { color: '#fff', backgroundColor: '#1e1e1e' } }}
                  InputLabelProps={{ style: { color: '#bbb' } }}
                />
              </>
            )}

            {/* Step 1 – OTP */}
            {step === 1 && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                label="Enter OTP"
                value={otp}
                onChange={e => handleOtpChange(e.target.value)}
                disabled={loading}
                error={!!errors.otp}
                helperText={errors.otp}
                InputProps={{ style: { color: '#fff', backgroundColor: '#1e1e1e' } }}
                InputLabelProps={{ style: { color: '#bbb' } }}
              />
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              sx={{ py: 1.5, bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' }, fontWeight: 'bold', mt: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : step === 0 ? 'Next' : 'Finish'}
            </Button>

            {step === 0 && (
              <Typography variant="body2" align="center" sx={{ mt: 3, color: '#ccc' }}>
                Already have an account?{' '}
                <Button onClick={() => navigate("/login")} variant="text" sx={{ color: '#90caf9' }}>Sign In</Button>
              </Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default RegisterPage;
