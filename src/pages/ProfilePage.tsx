import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserPrompts, deletePrompt } from '../services/PromptService';
import { Prompt } from '../models';
import {
  Container,
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';

const PromptCard: React.FC<{
  prompt: Prompt;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ prompt, onEdit, onDelete }) => (
  <Card
    variant="outlined"
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#121212',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 3,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      },
    }}
  >
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6" gutterBottom color="white">
        {prompt.title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
        {prompt.content}
      </Typography>
    </CardContent>
    <CardActions sx={{ pl: 2, pb: 2, justifyContent: 'space-between' }}>
      <Button size="small" onClick={onEdit} sx={{ color: '#90caf9' }}>
        Edit
      </Button>
      <Button size="small" color="error" onClick={onDelete}>
        Delete
      </Button>
    </CardActions>
  </Card>
);

const ProfilePage: React.FC = () => {
  const { user: loggedInUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(true);

  useEffect(() => {
    const fetchUserPrompts = async () => {
      if (loggedInUser?._id) {
        try {
          setLoadingPrompts(true);
          const userPrompts = await getUserPrompts(loggedInUser._id);
          setPrompts(userPrompts);
        } catch (error) {
          console.error('Failed to fetch user prompts:', error);
        } finally {
          setLoadingPrompts(false);
        }
      } else {
        setLoadingPrompts(false);
      }
    };
    if (!authLoading) fetchUserPrompts();
  }, [loggedInUser, authLoading]);

  const handleEdit = (promptId: string) => {
    navigate(`/update-prompt/${promptId}`);
  };

  const handleDelete = async (promptId: string) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      try {
        await deletePrompt(promptId);
        setPrompts((prev) => prev.filter((p) => p._id !== promptId));
      } catch (error) {
        console.error('Failed to delete prompt:', error);
      }
    }
  };

  if (authLoading || loadingPrompts) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: '#000',
          color: 'white',
        }}
      >
        <CircularProgress color="inherit" />
        <Typography sx={{ ml: 2 }}>Loading Profile...</Typography>
      </Box>
    );
  }

  if (!loggedInUser) {
    return (
      <Box sx={{ bgcolor: '#000', color: 'white', minHeight: '100vh', pt: 4 }}>
        <Typography variant="h6" align="center">
          Please log in to view your profile.
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            variant="contained"
            sx={{ bgcolor: '#90caf9' }}
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#000', minHeight: '100vh', color: 'white', py: 4 }}>
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 4,
            borderRadius: '12px',
            bgcolor: '#1e1e1e',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            alignItems={{ xs: 'center', md: 'flex-start' }}
          >
            <Avatar
              src={loggedInUser.avatar || '/default-avatar.png'}
              alt={loggedInUser.username || 'User'}
              sx={{ width: 96, height: 96 }}
            />
            <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h4" fontWeight="bold">
                {loggedInUser.username || 'Unnamed User'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                {loggedInUser.email || 'No email provided'}
              </Typography>
              <Button
                variant="outlined"
                size="medium"
                sx={{
                  mt: 2,
                  borderColor: '#90caf9',
                  color: '#90caf9',
                  '&:hover': {
                    borderColor: '#64b5f6',
                    backgroundColor: 'rgba(144,202,249,0.1)',
                  },
                }}
                onClick={() => navigate('/edit-profile')}
              >
                Edit Profile
              </Button>
            </Box>
          </Stack>
        </Paper>

        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          My Prompts
        </Typography>

        <Grid container spacing={3}>
          {prompts.length > 0 ? (
            prompts.map((prompt) => (
              <Grid item xs={12} sm={6} md={4} key={prompt._id}>
                <PromptCard
                  prompt={prompt}
                  onEdit={() => handleEdit(prompt._id)}
                  onDelete={() => handleDelete(prompt._id)}
                />
              </Grid>
            ))
          ) : (
            <Typography sx={{ ml: 3, mt: 2, color: 'rgba(255,255,255,0.6)' }}>
              You haven't created any prompts yet.
            </Typography>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage;
