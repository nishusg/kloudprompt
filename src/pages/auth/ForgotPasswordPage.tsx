// src/pages/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Card, CardContent, Typography, TextField, Button,
  CircularProgress
} from '@mui/material';
import { useSnackbar } from '../../context/SnackbarContext';
import { requestOtp, verifyOtp} from '../../services/OtpService';
import { OTPPurpose } from '../../utils/Enum';
import { resetPassword } from '../../services/UserService';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleNext = async () => {
    setLoading(true);

    try {
      if (step === 0) {
        if (!email.trim()) throw new Error("Email is required");

        await requestOtp(email, OTPPurpose.Forgot);
        showSnackbar('OTP sent to your email!', 'success');
        setStep(1);
      } else if (step === 1) {
        if (!otp.trim()) throw new Error("OTP is required");

        await verifyOtp(email, otp, OTPPurpose.Forgot);
        showSnackbar('OTP verified successfully!', 'success');
        setStep(2);
      } else if (step === 2) {
        if (!password.trim() || !confirm.trim()) throw new Error("All fields are required");
        if (password !== confirm) throw new Error("Passwords do not match");

        await resetPassword(email, password);
        showSnackbar('Password reset successfully!', 'success');
        navigate("/login");
      }
    } catch (error: any) {
      showSnackbar(error instanceof Error ? error.message : 'Operation failed', 'error');
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
              Forgot Password
            </Typography>

            <Box component="form" noValidate>
              {step === 0 && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="email"
                  id="email"
                  label="Email Address"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  variant="outlined"
                  InputProps={{ style: { color: '#fff', backgroundColor: '#1e1e1e' } }}
                  InputLabelProps={{ style: { color: '#bbb' } }}
                />
              )}

              {step === 1 && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="otp"
                  label="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                  variant="outlined"
                  InputProps={{ style: { color: '#fff', backgroundColor: '#1e1e1e' } }}
                  InputLabelProps={{ style: { color: '#bbb' } }}
                />
              )}

              {step === 2 && (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    variant="outlined"
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
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    disabled={loading}
                    variant="outlined"
                    InputProps={{ style: { color: '#fff', backgroundColor: '#1e1e1e' } }}
                    InputLabelProps={{ style: { color: '#bbb' } }}
                  />
                </>
              )}

              <Button
                fullWidth
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                sx={{ py: 1.5, bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' }, fontWeight: 'bold', mt: 2 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : step === 2 ? "Reset Password" : "Next"}
              </Button>
            </Box>

            <Typography variant="body2" align="center" sx={{ mt: 3, color: '#ccc' }}>
              Remembered your password?{' '}
              <Button onClick={() => navigate("/login")} variant="text" sx={{ color: '#90caf9' }}>Sign In</Button>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;
