import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserPrompts, deletePrompt } from '../services/PromptService';
import { getUserBookmarks } from '../services/BookmarkService';
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
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ProfilePromptCard from '../components/prompts/ProfilePromptCard';

const ProfilePage: React.FC = () => {
  const { user: loggedInUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [bookmarkedPrompts, setBookmarkedPrompts] = useState<Prompt[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [view, setView] = useState<'prompts' | 'bookmarks'>('prompts');

  useEffect(() => {
    const fetchData = async () => {
      if (loggedInUser?._id) {
        try {
          setLoadingData(true);
          const [userPrompts, bookmarks] = await Promise.all([
            getUserPrompts(loggedInUser._id),
            getUserBookmarks(loggedInUser._id),
          ]);
          setPrompts(userPrompts);
          setBookmarkedPrompts(bookmarks);
        } catch (error) {
          console.error('Failed to fetch profile data:', error);
        } finally {
          setLoadingData(false);
        }
      } else {
        setLoadingData(false);
      }
    };
    if (!authLoading) fetchData();
  }, [loggedInUser, authLoading]);

  const handleEdit = (promptId: string) => {
    navigate(`/update/${promptId}`);
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

  if (authLoading || loadingData) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(160deg, #0d0d0d, #1a1a1d)',
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
      <Box
        sx={{
          background: 'linear-gradient(160deg, #0d0d0d, #1a1a1d)',
          color: 'white',
          minHeight: '100vh',
          pt: 4,
        }}
      >
        <Typography variant="h6" align="center">
          Please log in to view your profile.
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#42a5f5',
              color: '#000',
              fontWeight: 600,
              borderRadius: '50px',
              px: 3,
              '&:hover': { bgcolor: '#42a5f5' },
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
        background: '#0a0a0a',
      }}
    >
      <Container maxWidth="md">
        {/* Profile Header */}
        <Paper
          elevation={6}
          sx={{
            p: { xs: 2, md: 4 },
            mb: 4,
            borderRadius: '24px',
            background: '#121212',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <Stack direction="row" spacing={{ xs: 2, md: 3 }} alignItems="center">
            <Avatar
              src={'/default-avatar.png'}
              alt={loggedInUser.userName || 'User'}
              sx={{
                width: { xs: 80, sm: 90, md: 100 },
                height: { xs: 80, sm: 90, md: 100 },
                border: '3px solid #42a5f5',
                transition: 'transform 0.25s ease',
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
                  borderColor: '#42a5f5',
                  color: '#42a5f5',
                  fontWeight: 600,
                  borderRadius: '50px',
                  px: 2,
                  '&:hover': {
                    borderColor: '#42a5f5',
                    backgroundColor: 'rgba(144,202,249,0.1)',
                  },
                }}
                onClick={() => navigate('/update')}
              >
                Edit Profile
              </Button>
            </Box>
          </Stack>
        </Paper>

        {/* Toggle Buttons */}
        <Stack direction="row" spacing={2} mb={3}>
          <Button
            variant={view === 'prompts' ? 'contained' : 'outlined'}
            sx={{
              borderRadius: '50px',
              px: 3,
              fontWeight: 600,
              textTransform: 'none',
              bgcolor: view === 'prompts' ? '#42a5f5' : 'transparent',
              color: view === 'prompts' ? '#ffffffff' : '#42a5f5',
              borderColor: '#42a5f5',
              boxShadow: view === 'prompts'
                ? '0 4px 14px rgba(144,202,249,0.4)'
                : 'none',
              '&:hover': {
                bgcolor: '#42a5f5',
                color: '#000000ff',
                boxShadow: '0 6px 20px rgba(144,202,249,0.5)',
              },
            }}
            onClick={() => setView('prompts')}
          >
            My Prompts
          </Button>
          <Button
            variant={view === 'bookmarks' ? 'contained' : 'outlined'}
            sx={{
              borderRadius: '50px',
              px: 3,
              fontWeight: 600,
              textTransform: 'none',
              bgcolor: view === 'bookmarks' ? '#9e9e9e' : 'transparent', // Medium-light gray
              color: view === 'bookmarks' ? '#000' : '#e0e0e0',           // Light gray text
              borderColor: '#9e9e9e',
              boxShadow: view === 'bookmarks'
                ? '0 4px 14px rgba(158,158,158,0.4)'
                : 'none',
              '&:hover': {
                bgcolor: '#d8d5d5ff',                                      // Slightly lighter on hover
                color: '#000',
                boxShadow: '0 6px 20px rgba(189,189,189,0.5)',
              },

            }}
            onClick={() => setView('bookmarks')}
          >
            Bookmarked Prompts
          </Button>
        </Stack>

        {/* Animated Content */}
        <AnimatePresence mode="wait">
          {view === 'prompts' && (
            <motion.div
              key="prompts"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <Grid container spacing={3}>
                {prompts.length > 0 ? (
                  prompts.map((prompt) => (
                    <Grid item xs={12} key={prompt._id}>
                      <ProfilePromptCard
                        prompt={prompt}
                        onView={() => navigate(`/prompts/${prompt._id}`)}
                        onEdit={() => handleEdit(prompt._id)}
                        onDelete={() => handleDelete(prompt._id)}
                      />
                    </Grid>
                  ))
                ) : (
                  <Typography sx={{ ml: 1, mt: 2, color: 'rgba(255,255,255,0.6)' }}>
                    You haven't created any prompts yet.
                  </Typography>
                )}
              </Grid>
            </motion.div>
          )}

          {view === 'bookmarks' && (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Grid container spacing={3}>
                {bookmarkedPrompts.length > 0 ? (
                  bookmarkedPrompts.map((prompt) => (
                    <Grid item xs={12} key={prompt._id}>
                      <ProfilePromptCard
                        prompt={prompt}
                        onView={() => navigate(`/prompts/${prompt._id}`)}
                      />
                    </Grid>
                  ))
                ) : (
                  <Typography sx={{ ml: 1, mt: 2, color: 'rgba(255,255,255,0.6)' }}>
                    You haven't bookmarked any prompts yet.
                  </Typography>
                )}
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default ProfilePage;
