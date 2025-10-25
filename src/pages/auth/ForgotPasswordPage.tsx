import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button,
  CircularProgress, Link, InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSnackbar } from '../../context/SnackbarContext';
import { requestOtp, verifyOtp } from '../../services/OtpService';
import { OTPPurpose } from '../../utils/Enum';
import { resetPassword } from '../../services/UserService';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ email?: string; otp?: string; password?: string; confirm?: string }>({});

  const handleNext = async () => {
    setLoading(true);
    try {
      if (step === 0) {
        if (!email.trim()) { setErrors({ email: 'Email is required' }); return; }
        setErrors({});
        await requestOtp(email, OTPPurpose.Forgot);
        showSnackbar('OTP sent to your email!', 'success');
        setStep(1);

      } else if (step === 1) {
        if (!otp.trim()) { setErrors({ otp: 'OTP is required' }); return; }
        setErrors({});
        await verifyOtp(email, otp, OTPPurpose.Forgot);
        showSnackbar('OTP verified successfully!', 'success');
        setStep(2);

      } else if (step === 2) {
        const newErrors: typeof errors = {};
        if (!password.trim()) newErrors.password = 'Password is required';
        if (!confirm.trim()) newErrors.confirm = 'Confirm password is required';
        if (password && confirm && password !== confirm) newErrors.confirm = 'Passwords do not match';

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }
        setErrors({});
        await resetPassword(email, password);
        showSnackbar('Password reset successfully!', 'success');
        navigate('/login');
      }
    } catch (error: any) {
      showSnackbar(error?.message || 'Operation failed', 'error');
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
      {/* Blue background glow */}
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

      {/* Left branding */}
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
          Reset your password securely and quickly — stay in control of your account.
        </Typography>
      </Box>

      {/* Right form */}
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
              {step === 0 ? 'Forgot Password' : step === 1 ? 'Verify OTP' : 'Reset Password'}
            </Typography>
            <Typography
              variant="body2"
              align="center"
              sx={{ mb: 3, color: '#9db6d6', fontSize: { xs: '0.9rem', md: '1rem' } }}
            >
              {step === 0
                ? 'Enter your email to receive OTP'
                : step === 1
                ? 'Enter the OTP sent to your email'
                : 'Set your new password'}
            </Typography>

            <Box component="form" noValidate>
              {step === 0 && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    style: { color: '#e6f1ff', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10 },
                  }}
                  InputLabelProps={{ style: { color: '#9db6d6' } }}
                />
              )}

              {step === 1 && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  disabled={loading}
                  error={!!errors.otp}
                  helperText={errors.otp}
                  InputProps={{
                    style: { color: '#e6f1ff', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10 },
                  }}
                  InputLabelProps={{ style: { color: '#9db6d6' } }}
                />
              )}

              {step === 2 && (
                <>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                    error={!!errors.password}
                    helperText={errors.password}
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
                    InputLabelProps={{ style: { color: '#9db6d6' } }}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    disabled={loading}
                    error={!!errors.confirm}
                    helperText={errors.confirm}
                    InputProps={{
                      style: { color: '#e6f1ff', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10 },
                    }}
                    InputLabelProps={{ style: { color: '#9db6d6' } }}
                  />
                </>
              )}

              <Button
                fullWidth
                variant="contained"
                onClick={handleNext}
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
                  '&:hover': { background: 'linear-gradient(90deg, #00b3ff, #003db8)' },
                }}
              >
                {loading
                  ? <CircularProgress size={24} color="inherit" />
                  : step === 2
                  ? 'Reset Password'
                  : 'Next'}
              </Button>

              <Typography align="center" sx={{ mt: 3, color: '#9db6d6', fontSize: { xs: '0.9rem', md: '1rem' } }}>
                Remembered your password?{' '}
                <Link component={RouterLink} to="/login" sx={{ color: '#00aaff', fontWeight: 500 }}>
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
