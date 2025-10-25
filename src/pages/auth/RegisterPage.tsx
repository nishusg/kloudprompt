import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword, validateUsername } from '../../utils/Validators';
import {
  Container, Box, Typography, TextField, Button,
  CircularProgress, Link, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSnackbar } from '../../context/SnackbarContext';
import { requestOtp, verifyOtp } from '../../services/OtpService';
import { OTPPurpose } from '../../utils/Enum';

const RegisterPage: React.FC = () => {
  const { register, login } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    switch (field) {
      case 'userName':
        setUserName(value);
        const uVal = validateUsername(value);
        setErrors(prev => ({ ...prev, userName: uVal.valid ? '' : uVal.message || '' }));
        break;
      case 'email':
        setEmail(value);
        setErrors(prev => ({ ...prev, email: validateEmail(value) ? '' : 'Please enter a valid email' }));
        break;
      case 'password':
        setPassword(value);
        const pVal = validatePassword(value);
        setErrors(prev => ({
          ...prev,
          password: pVal.valid ? '' : pVal.message || '',
          confirmPassword: confirmPassword === value ? '' : 'Passwords do not match',
        }));
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        setErrors(prev => ({ ...prev, confirmPassword: password === value ? '' : 'Passwords do not match' }));
        break;
      case 'otp':
        setOtp(value);
        setErrors(prev => ({ ...prev, otp: value.trim() ? '' : 'OTP is required' }));
        break;
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (step === 0) {
        // Validate all fields
        const userNameError = validateUsername(userName).valid ? '' : validateUsername(userName).message || '';
        const emailError = validateEmail(email) ? '' : 'Please enter a valid email';
        const passwordError = validatePassword(password).valid ? '' : validatePassword(password).message || '';
        const confirmPasswordError = password === confirmPassword ? '' : 'Passwords do not match';

        const newErrors = {
          userName: userNameError,
          email: emailError,
          password: passwordError,
          confirmPassword: confirmPasswordError,
        };
        setErrors(newErrors);
        if (Object.values(newErrors).some(x => x)) return;

        await register(userName, email, password);
        await requestOtp(email, OTPPurpose.Register);
        showSnackbar('OTP sent to your email!', 'success');
        setStep(1);
      } else {
        if (!otp.trim()) {
          setErrors(prev => ({ ...prev, otp: 'OTP is required' }));
          return;
        }
        await verifyOtp(email, otp, OTPPurpose.Register);
        showSnackbar('Registration successful!', 'success');
        await login(email, password);
        navigate('/');
      }
    } catch (error: any) {
      showSnackbar(error?.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
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
      {/* Floating glows */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: { xs: '200px', md: '400px' },
          height: { xs: '200px', md: '400px' },
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
          width: { xs: '200px', md: '400px' },
          height: { xs: '200px', md: '400px' },
          background: 'radial-gradient(circle, rgba(0,204,255,0.25), transparent 70%)',
          filter: 'blur(100px)',
          zIndex: 0,
        }}
      />

      {/* LEFT Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
          textAlign: 'center',
          p: 5,
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            letterSpacing: '-0.02em',
            mb: 2,
            fontSize: '3rem',
            background: 'linear-gradient(90deg, #00aaff, #007bff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          KloudPrompt
        </Typography>
        <Typography
          sx={{
            color: '#b0c4de',
            maxWidth: 420,
            lineHeight: 1.6,
          }}
        >
          Join the creative hub for sharing and enhancing prompts — beautifully simple, smart, and powerful.
        </Typography>
      </Box>

      {/* RIGHT Form */}
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
              background: 'rgba(15,25,45,0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,150,255,0.15)',
              borderRadius: 4,
              boxShadow: '0 0 40px rgba(0,80,255,0.2)',
              p: { xs: 3, md: 5 },
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              align="center"
              sx={{ mb: 1, fontSize: { xs: '1.5rem', md: '1.8rem' } }}
            >
              {step === 0 ? 'Create Your Account' : 'Verify OTP'}
            </Typography>
            <Typography
              variant="body2"
              align="center"
              sx={{ mb: 3, color: '#9db6d6', fontSize: { xs: '0.9rem', md: '1rem' } }}
            >
              {step === 0 ? 'Fill in your details to get started' : 'Enter the OTP sent to your email'}
            </Typography>

            <Box component="form" onSubmit={handleNext} noValidate>
              {step === 0 ? (
                <>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Username"
                    value={userName}
                    onChange={e => handleChange('userName', e.target.value)}
                    error={!!errors.userName}
                    helperText={errors.userName}
                    InputLabelProps={{ style: { color: '#9db6d6' } }}
                    InputProps={{
                      style: { color: '#e6f1ff', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10 },
                    }}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={e => handleChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputLabelProps={{ style: { color: '#9db6d6' } }}
                    InputProps={{
                      style: { color: '#e6f1ff', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10 },
                    }}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => handleChange('password', e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputLabelProps={{ style: { color: '#9db6d6' } }}
                    InputProps={{
                      style: { color: '#e6f1ff', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10 },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: '#9db6d6' }}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => handleChange('confirmPassword', e.target.value)}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputLabelProps={{ style: { color: '#9db6d6' } }}
                    InputProps={{
                      style: { color: '#e6f1ff', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10 },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            sx={{ color: '#9db6d6' }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              ) : (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Enter OTP"
                  value={otp}
                  onChange={e => handleChange('otp', e.target.value)}
                  error={!!errors.otp}
                  helperText={errors.otp}
                  InputLabelProps={{ style: { color: '#9db6d6' } }}
                  InputProps={{
                    style: { color: '#e6f1ff', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10 },
                  }}
                />
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.3,
                  borderRadius: 10,
                  background: 'linear-gradient(90deg, #00aaff, #007bff)',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 0 15px rgba(0,120,255,0.5)',
                  '&:hover': { background: 'linear-gradient(90deg, #00b3ff, #005ce6)' },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : step === 0 ? 'Next' : 'Finish'}
              </Button>

              {step === 0 && (
                <Typography align="center" sx={{ mt: 3, color: '#9db6d6', fontSize: { xs: '0.9rem', md: '1rem' } }}>
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/login" sx={{ color: '#00aaff', fontWeight: 500 }}>
                    Sign In
                  </Link>
                </Typography>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default RegisterPage;
