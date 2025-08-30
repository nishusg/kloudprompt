import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Button, Container, Paper, TextField, Typography, Stack, 
  IconButton, InputAdornment 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { changePassword } from '../../services/UserService'; 
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';

const ChangePasswordPage: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedInUser?._id) return;

    setLoading(true);
    try {
      await changePassword(loggedInUser._id, currentPassword, newPassword);
      showSnackbar('Password updated successfully!', 'success');
      setTimeout(() => navigate('/profile/' + loggedInUser._id), 1500);
    } catch (err: any) {
      showSnackbar(err?.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        background: "#0a0a0a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
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
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            gutterBottom
            color="#fff"
          >
            Change Password
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Current Password */}
              <TextField
                type={showCurrentPassword ? "text" : "password"}
                label="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                required
                InputLabelProps={{ style: { color: '#aaa' } }}
                InputProps={{
                  style: { color: 'white' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        edge="end"
                        sx={{ color: '#aaa' }}
                      >
                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {/* New Password */}
              <TextField
                type={showNewPassword ? "text" : "password"}
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                required
                InputLabelProps={{ style: { color: '#aaa' } }}
                InputProps={{
                  style: { color: 'white' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                        sx={{ color: '#aaa' }}
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ borderRadius: '50px', fontWeight: 600 }}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
              <Button
                variant="text"
                sx={{ color: "#aaa", textTransform: "none" }}
                onClick={() => navigate("/profile/" + loggedInUser?._id)}
              >
                Cancel
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChangePasswordPage;
