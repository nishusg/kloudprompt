import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserPrompts, deletePrompt, toggleBookmarkPrompt } from '../../services/PromptService';
import { getUserBookmarks } from '../../services/BookmarkService';
import { Prompt } from '../../models';
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
  Chip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ProfilePromptCard from '../../components/prompts/ProfilePromptCard';
import PromptActivityGraph from '../../components/prompts/PromptActivityGraph';
import { DefaultUserName } from '../../utils/Constants';
import { useSnackbar } from '../../context/SnackbarContext';
import { VerificationStatus } from '../../utils/Enum';

const ProfilePage: React.FC = () => {
  const { user: loggedInUser, loading: authLoading } = useAuth();
  const { showSnackbar } = useSnackbar();
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

  const handleDeletePrompt = async (promptId: string) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      try {
        await deletePrompt(promptId);
        setPrompts((prev) => prev.filter((p) => p._id !== promptId));
        showSnackbar('Prompt deleted successfully', 'success');
      } catch (error) {
        showSnackbar('Failed to delete prompt:', 'error');
      }
    }
  };

  const handleBookmarkRemoved = async (promptId: string) => {
    try {
      await toggleBookmarkPrompt(promptId);

      // Remove from bookmarked list
      setBookmarkedPrompts((prev) => prev.filter((p) => p._id !== promptId));

      showSnackbar("Removed from bookmarks", "success");
    } catch (err) {
      console.error("Failed to remove bookmark", err);
      showSnackbar("Failed to remove bookmark", "error");
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

  // ✅ Use socialLinks only if it exists
  const socialLinks = loggedInUser.socialLinks || {};

  return (
    <Box sx={{ minHeight: '100vh', color: 'white', py: 4, background: '#0a0a0a' }}>
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
              alt={loggedInUser.userName || DefaultUserName}
              sx={{
                width: { xs: 80, sm: 90, md: 100 },
                height: { xs: 80, sm: 90, md: 100 },
                bgcolor: '#42a5f5',
                color: '#fff',
                fontSize: '2rem',
              }}
            >
              {(loggedInUser.userName || DefaultUserName).charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  color: '#fff',
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                }}
              >
                {loggedInUser.fullName || loggedInUser.userName || 'Unnamed User'}
              </Typography>
              <Typography
                component={'div'}
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {loggedInUser.email || 'No email provided'}
                  {/* Verification Chip */}
                  {loggedInUser.verificationStatus && (
                    <Chip
                      label={loggedInUser.verificationStatus == VerificationStatus.Verified ? "Verified" : "Pending"}
                      size="small"
                      color={loggedInUser.verificationStatus == VerificationStatus.Verified ? "success" : "error"}
                      sx={{ fontSize: '0.60rem' }}
                    />
                  )}
              </Typography>

              {/* Phone */}
              {loggedInUser.phone && (<Typography
                variant="body2"
                sx={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {loggedInUser.phone}
              </Typography>)}

              {/* Bio */}
              {loggedInUser.bio && (
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
                  {loggedInUser.bio}
                </Typography>
              )}

              {/* ✅ Social Links Only if They Exist */}
              {Object.entries(socialLinks).length > 0 && (
                <Stack spacing={1} mt={1}>
                  {Object.entries(socialLinks).map(([platform, url]) =>
                    url ? (
                      <Stack
                        key={platform}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "#aaa", fontWeight: 600, minWidth: 80 }}
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </Typography>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#42a5f5",
                            textDecoration: "none",
                            wordBreak: "break-all",
                          }}
                        >
                          link
                        </a>
                      </Stack>
                    ) : null
                  )}
                </Stack>
              )}

              <hr style={{ border: '0.5px solid rgba(255,255,255,0.1)', margin: '12px 0' }} />

              {/* Actions */}
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    mt: 1.5,
                    borderColor: '#42a5f5',
                    color: '#42a5f5',
                    fontWeight: { xs: 400, sm: 500, md: 600 },
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
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    mt: 1.5,
                    fontWeight: { xs: 400, sm: 500, md: 600 },
                    borderRadius: '50px',
                    px: 2,
                    bgcolor: '#42a5f5',
                    color: '#000000ff',
                    borderColor: '#42a5f5',
                    '&:hover': {
                      bgcolor: '#42a5f5',
                      color: '#000',
                    },
                  }}
                  onClick={() => navigate('/change-password')}
                >
                  Change Password
                </Button>
                {loggedInUser.verificationStatus === 'pending' && (
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: 1.5,
                      borderColor: '#42a5f5',
                      color: '#42a5f5',
                      fontWeight: { xs: 400, sm: 500, md: 600 },
                      borderRadius: '50px',
                      px: 2,
                      '&:hover': {
                        borderColor: '#42a5f5',
                        backgroundColor: 'rgba(144,202,249,0.1)',
                      },
                    }}
                    onClick={() => navigate('/email-verification')}
                  >
                    Verify Email
                  </Button>
                )}
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* Prompt Activity Graph */}
        <PromptActivityGraph prompts={prompts} />

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
              color: view === 'prompts' ? '#000' : '#fff',
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
              bgcolor: view === 'bookmarks' ? '#42a5f5' : 'transparent', // Medium-light gray
              color: view === 'bookmarks' ? '#000' : '#e0e0e0',           // Light gray text
              borderColor: '#42a5f5',
              boxShadow: view === 'bookmarks'
                ? '0 4px 14px rgba(158,158,158,0.4)'
                : 'none',
              '&:hover': {
                bgcolor: '#42a5f5',                                      // Slightly lighter on hover
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
                        onDelete={() => handleDeletePrompt(prompt._id)}
                      />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: "center", mt: 0 }}>
                      <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)" }}>
                        You haven't created any prompts yet.
                      </Typography>
                    </Box>
                  </Grid>
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
                        onRemoved={() => handleBookmarkRemoved(prompt._id)}
                      />
                    </Grid>
                  ))
                ) : (
                    <Grid item xs={12}>
                      <Box sx={{ textAlign: "center", mt: 0 }}>
                        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)" }}>
                          You haven't bookmarked any prompts yet.
                        </Typography>
                      </Box>
                    </Grid>
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
