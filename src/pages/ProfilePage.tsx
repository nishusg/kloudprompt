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
  onView: () => void;
}> = ({ prompt, onEdit, onDelete, onView }) => (
  <Card
    variant="outlined"
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#1a1a1a',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 3,
      transition: 'all 0.25s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 6px 24px rgba(144,202,249,0.25)',
        borderColor: '#90caf9',
      },
    }}
    onClick={onView}
  >
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: '#fff', fontWeight: 600, letterSpacing: 0.3 }}
      >
        {prompt.title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(255,255,255,0.7)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {prompt.content}
      </Typography>
    </CardContent>
    <CardActions sx={{ pl: 2, pb: 2, justifyContent: 'space-between' }}>
      <Button
        size="small"
        sx={{ color: '#90caf9' }}
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
      >
        Edit
      </Button>
      <Button
        size="small"
        sx={{ color: '#ef5350' }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
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
          bgcolor: 'linear-gradient(145deg, #0d0d0d, #1c1c1c)',
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
      <Box sx={{ bgcolor: '#0d0d0d', color: 'white', minHeight: '100vh', pt: 4 }}>
        <Typography variant="h6" align="center">
          Please log in to view your profile.
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#90caf9',
              color: '#000',
              '&:hover': { bgcolor: '#64b5f6' },
            }}
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        color: 'white',
        py: 4,
        background: 'linear-gradient(145deg, #0d0d0d, #1a1a1a)',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 2, md: 4 },
            mb: 4,
            borderRadius: '20px',
            background: 'linear-gradient(145deg, #1f1f1f, #2b2b2b)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Stack
            direction="row"
            spacing={{ xs: 2, md: 3 }}
            alignItems="center"
          >
            <Avatar
              src={'/default-avatar.png'}
              alt={loggedInUser.userName || 'User'}
              sx={{
                width: { xs: 70, sm: 80, md: 96 },
                height: { xs: 70, sm: 80, md: 96 },
                border: '3px solid #90caf9',
                boxShadow: '0 0 10px rgba(144,202,249,0.4)',
                flexShrink: 0,
              }}
            />

            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  color: '#fff',
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                }}
              >
                {loggedInUser.userName || 'Unnamed User'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                }}
              >
                {loggedInUser.email || 'No email provided'}
              </Typography>

              <Button
                variant="outlined"
                size="small"
                sx={{
                  mt: 1.5,
                  borderColor: '#90caf9',
                  color: '#90caf9',
                  fontWeight: 600,
                  minWidth: { xs: '90px', md: 'auto' },
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


        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            mb: 3,
            color: '#90caf9',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            pb: 1,
          }}
        >
          My Prompts
        </Typography>

        <Grid container spacing={3}>
          {prompts.length > 0 ? (
            prompts.map((prompt) => (
              <Grid item xs={12} sm={6} md={4} key={prompt._id}>
                <PromptCard
                  prompt={prompt}
                  onView={() => navigate(`/prompts/${prompt._id}`)}
                  onEdit={() => handleEdit(prompt._id)}
                  onDelete={() => handleDelete(prompt._id)}
                />
              </Grid>
            ))
          ) : (
            <Typography
              sx={{
                ml: 3,
                mt: 2,
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              You haven't created any prompts yet.
            </Typography>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage;
