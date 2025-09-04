// src/components/EmailVerification.tsx
import React, { useState } from 'react';
import { Box, Button, Container, Paper, Typography, Stack, TextField } from '@mui/material';
import { useSnackbar } from '../../context/SnackbarContext';
import { useAuth } from '../../context/AuthContext';
import { requestOtp, verifyOtp } from '../../services/OtpService';
import { OTPPurpose } from '../../utils/Enum';
import { useNavigate } from 'react-router-dom';

const EmailVerification: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const email = loggedInUser?.email || '';

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');

  // Send OTP
  const handleSendOtp = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await requestOtp(email, OTPPurpose.Register);
      showSnackbar('Verification email sent!', 'success');
    } catch (error: any) {
      showSnackbar(
        error?.response?.data?.msg || (error instanceof Error ? error.message : 'Failed to send verification email'),
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      showSnackbar('OTP is required', 'error');
      return;
    }
    if (!email) return;

    setLoading(true);
    try {
      await verifyOtp(email, otp, OTPPurpose.Register);
      showSnackbar('Email verified successfully!', 'success');

      setTimeout(() => navigate('/profile/' + loggedInUser?._id), 1500);
    } catch (error: any) {
      showSnackbar(error?.response?.data?.msg || (error instanceof Error ? error.message : 'OTP verification failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: '24px',
            background: '#121212',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom color="#fff">
            Verify Your Email
          </Typography>

          <Typography variant="body2" color="#ccc" mb={2}>
            Your email is not verified. Enter the OTP sent to <strong>{email}</strong>.
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              size="small"
              disabled={loading}
              InputLabelProps={{ style: { color: '#aaa' } }}
              InputProps={{ style: { color: 'white' } }}
              fullWidth
            />

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="success"
                onClick={handleVerifyOtp}
                sx={{ flex: 1, borderRadius: '50px', fontWeight: 600 }}
              >
                Verify OTP
              </Button>

              <Button
                variant="outlined"
                color="primary"
                onClick={handleSendOtp}
                sx={{ flex: 1, borderRadius: '50px', fontWeight: 600 }}
              >
                Resend OTP
              </Button>
            </Stack>

            <Button
                variant="outlined"
                sx={{ textTransform: "none", borderRadius: "50px" }}
                onClick={() => navigate("/profile/" + loggedInUser?._id)}
            >
            Cancel
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default EmailVerification;
