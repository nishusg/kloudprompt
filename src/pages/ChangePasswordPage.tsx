import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Paper, TextField, Typography, Stack } from '@mui/material';
import { changePassword } from '../services/UserService'; // <-- you’ll implement this API call
import { useAuth } from '../context/AuthContext';

const ChangePasswordPage: React.FC = () => {
    const { user: loggedInUser } = useAuth(); // optional setUser to update context
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loggedInUser?._id) return;
        setLoading(true);
        setError('');
        setSuccess('');
        try {
        await changePassword(loggedInUser._id, currentPassword, newPassword);
        setSuccess('Password updated successfully!');
        setTimeout(() => navigate('/profile/'+loggedInUser._id), 1500);
        } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to change password');
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
                <TextField
                    type="password"
                    label="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{ style: { color: '#aaa' } }}
                    InputProps={{ style: { color: 'white' } }}
                />

                <TextField
                    type="password"
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{ style: { color: '#aaa' } }}
                    InputProps={{ style: { color: 'white' } }}
                />

                {error && <Typography color="error">{error}</Typography>}
                {success && <Typography color="success.main">{success}</Typography>}

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
                    onClick={() => navigate("/profile/"+ loggedInUser?._id)}
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
