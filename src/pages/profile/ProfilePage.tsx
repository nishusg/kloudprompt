import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deletePrompt, toggleBookmarkPrompt } from '../../services/PromptService';
import { getUserBookmarks } from '../../services/BookmarkService';
import { Prompt, UserStats } from '../../models';
import {
  Container,
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  Stack,
  Chip,
  Pagination,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ProfilePromptCard from '../../components/prompts/ProfilePromptCard';
import PromptActivityGraph from '../../components/prompts/PromptActivityGraph';
import { DefaultUserName } from '../../utils/Constants';
import { useSnackbar } from '../../context/SnackbarContext';
import { VerificationStatus } from '../../utils/Enum';
import { getUserPrompts, getUserStats } from '../../services/UserService';
import ProfileSkeleton from '../../components/skeleton/ProfileSkeleton';
import ProfilePromptCardSkeleton from '../../components/skeleton/ProfilePromptCardSkeleton';

const ProfilePage: React.FC = () => {
  const { user: loggedInUser, loading: authLoading } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [bookmarkedPrompts, setBookmarkedPrompts] = useState<Prompt[]>([]);
  const [userStats, setUserStats] = useState<UserStats>();
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [view, setView] = useState<'prompts' | 'bookmarks'>('prompts');

  const initialPage = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const MemoizedGraph = React.memo(PromptActivityGraph);

  const PAGE_LIMIT = 5; // prompts per page

  useEffect(() => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", currentPage.toString());
      return newParams;
    },{ replace: true });
  }, [currentPage, setSearchParams]);

  useEffect(() => {
    let isMounted = true;

    const fetchPrompts = async () => {
      if (!loggedInUser?._id) return;
      try {
        setLoadingPrompts(true);
        const { prompts, totalPages } = await getUserPrompts(loggedInUser._id, currentPage, PAGE_LIMIT);
        if (isMounted) {
          setPrompts(prompts);
          setTotalPages(totalPages);
        }
      } finally {
        if (isMounted) setLoadingPrompts(false);
      }
    };

    const fetchBookmarks = async () => {
      if (!loggedInUser?._id) return;
      try {
        setLoadingBookmarks(true);
        const { prompts, totalPages } = await getUserBookmarks(loggedInUser._id, currentPage, PAGE_LIMIT);
        if (isMounted) {
          setBookmarkedPrompts(prompts);
          setTotalPages(totalPages);
        }
      } finally {
        if (isMounted) setLoadingBookmarks(false);
      }
    };

    if (!authLoading) {
      if (view === "prompts") fetchPrompts();
      if (view === "bookmarks") fetchBookmarks();
    }

    return () => { isMounted = false; };
  }, [loggedInUser, authLoading, currentPage, view]);


  useEffect(() => {
    if (!loggedInUser?._id) return;

    const fetchStats = async () => {
      try {
        const stats = await getUserStats(loggedInUser._id);
        setUserStats(stats);
      } catch (err: any) {
        showSnackbar(err?.message || "Failed to fetch stats:", "error");
      }
    };

    fetchStats();
  }, [loggedInUser]);

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/users/${loggedInUser?._id}`;
      await navigator.clipboard.writeText(shareUrl);
      showSnackbar('Link copied to clipboard!', 'success');
    } catch (err: any) {
      showSnackbar(err?.message || 'Failed to copy link', 'error');
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      try {
        await deletePrompt(promptId);
        setPrompts((prev) => prev.filter((p) => p._id !== promptId));
        showSnackbar('Prompt deleted successfully', 'success');
      } catch (error) {
        showSnackbar('Failed to delete prompt', 'error');
      }
    }
  };

  const handleBookmarkRemoved = async (promptId: string) => {
    try {
      await toggleBookmarkPrompt(promptId);
      setBookmarkedPrompts((prev) => prev.filter((p) => p._id !== promptId));
      showSnackbar("Removed from bookmarks", "success");
    } catch (err: any) {
      console.error("Failed to remove bookmark", err);
      showSnackbar(err?.message || "Failed to remove bookmark", "error");
    }
  };

  if (authLoading) {
    return <ProfileSkeleton />;
  }

  if (!loggedInUser) {
    return (
      <Box sx={{ background: 'linear-gradient(160deg, #0d0d0d, #1a1a1d)', color: 'white', minHeight: '100vh', pt: 4 }}>
        <Typography variant="h6" align="center">Please log in to view your profile.</Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="contained" sx={{ bgcolor: '#42a5f5', color: '#000', fontWeight: 600, borderRadius: '50px', px: 3, '&:hover': { bgcolor: '#42a5f5' } }} onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </Box>
      </Box>
    );
  }

  const socialLinks = loggedInUser.socialLinks || {};

  return (
    <Box sx={{ minHeight: '100vh', color: 'white', py: 4, background: '#0a0a0a' }}>
      <Container maxWidth="md">
        {/* Profile Header */}
        <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: '24px', background: '#121212', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <Stack direction="row" spacing={{ xs: 2, md: 3 }} alignItems="center">
            <Avatar alt={loggedInUser.userName || DefaultUserName} sx={{ width: { xs: 80, sm: 90, md: 100 }, height: { xs: 80, sm: 90, md: 100 }, bgcolor: '#42a5f5', color: '#fff', fontSize: '2rem' }}>
              {(loggedInUser.userName || DefaultUserName).charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff', fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
                {loggedInUser.userName || 'Unnamed User'}
              </Typography>
              {loggedInUser.fullName && <Typography variant="body2" sx={{ color: '#bbb' }}>{loggedInUser.fullName}</Typography>}
              <Typography component={'div'} variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 1 }}>
                {loggedInUser.email || 'No email provided'}
                {loggedInUser.verificationStatus && (
                  <Chip label={loggedInUser.verificationStatus === VerificationStatus.Verified ? VerificationStatus.Verified : VerificationStatus.Pending} size="small" color={loggedInUser.verificationStatus === VerificationStatus.Verified ? "success" : "error"} sx={{ fontSize: '0.60rem' }} />
                )}
              </Typography>
              {loggedInUser.phone && (<Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>{loggedInUser.phone}</Typography>)}
              {loggedInUser.bio && (<Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>{loggedInUser.bio}</Typography>)}

              {Object.entries(socialLinks).length > 0 && (
                <Stack spacing={1} mt={1}>
                  {Object.entries(socialLinks).map(([platform, url]) =>
                    url ? (
                      <Stack key={platform} direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" sx={{ color: "#aaa", fontWeight: 600, minWidth: 80 }}>
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </Typography>
                        <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#42a5f5", textDecoration: "none", wordBreak: "break-all" }}>link</a>
                      </Stack>
                    ) : null
                  )}
                </Stack>
              )}

              <hr style={{ border: '0.5px solid rgba(255,255,255,0.1)', margin: '12px 0' }} />

              {/* Actions */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.2} // gives gap between buttons in column mode
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 2 }}
              >
                {/* Edit Profile */}
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#555',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: '10px',
                    px: 3,
                    textTransform: 'none',
                    width: { xs: '100%', sm: 'auto' }, // full width on mobile
                    '&:hover': { borderColor: '#888', backgroundColor: 'rgba(255,255,255,0.05)' }
                  }}
                  onClick={() => navigate('/update')}
                >
                  Edit Profile
                </Button>

                {/* Change Password */}
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#555',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: '10px',
                    px: 3,
                    textTransform: 'none',
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': { borderColor: '#888', backgroundColor: 'rgba(255,255,255,0.05)' }
                  }}
                  onClick={() => navigate('/change-password')}
                >
                  Change Password
                </Button>

                {/* Verify Email */}
                {loggedInUser.verificationStatus === VerificationStatus.Pending && (
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#ef5350',
                      color: '#fff',
                      fontWeight: 600,
                      borderRadius: '10px',
                      px: 3,
                      textTransform: 'none',
                      width: { xs: '100%', sm: 'auto' },
                      '&:hover': { borderColor: '#f6685e', backgroundColor: 'rgba(255,255,255,0.05)' }
                    }}
                    onClick={() => navigate('/email-verification')}
                  >
                    Verify Email
                  </Button>
                )}

                {/* Share Profile */}
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#555',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: '10px',
                    px: 3,
                    textTransform: 'none',
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': { borderColor: '#888', backgroundColor: 'rgba(255,255,255,0.05)' }
                  }}
                  onClick={handleShare}
                >
                  Share Profile
                </Button>
              </Stack>

            </Box>
          </Stack>
        </Paper>

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 3, mt: 2, mb: 3 }}>
          <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center', flex: 1, bgcolor: '#121212', color: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
            <Typography variant="h6" color="#aaa">Total Prompts</Typography>
            <Typography variant="h5" fontWeight="bold">{userStats?.totalPrompts || 0}</Typography>
          </Paper>
          <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center', flex: 1, bgcolor: '#121212', color: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
            <Typography variant="h6" color="#aaa">Total Views</Typography>
            <Typography variant="h5" fontWeight="bold">{userStats?.totalViews || 0}</Typography>
          </Paper>
        </Box>

        {/* Prompt Activity Graph */}
        {prompts?.length > 0 && (
          <MemoizedGraph prompts={prompts} currentStreak={loggedInUser.currentStreak || 0} maxStreak={loggedInUser.maxStreak || 0} />
        )}

        {/* Toggle Buttons */}
        <Stack direction="row" spacing={2} mb={3} justifyContent="center">
          <Button
            variant={view === 'prompts' ? 'contained' : 'outlined'}
            sx={{ borderRadius: '50px', px: 3, fontWeight: 600, textTransform: 'none', bgcolor: view === 'prompts' ? '#42a5f5' : 'transparent', color: view === 'prompts' ? '#000' : '#fff', borderColor: '#42a5f5', boxShadow: view === 'prompts' ? '0 4px 14px rgba(144,202,249,0.4)' : 'none', '&:hover': { bgcolor: '#42a5f5', color: '#000000ff', boxShadow: '0 6px 20px rgba(144,202,249,0.5)' } }}
            onClick={() => { setView('prompts'); setCurrentPage(1); }}
          >
            My Prompts
          </Button>
          <Button
            variant={view === 'bookmarks' ? 'contained' : 'outlined'}
            sx={{ borderRadius: '50px', px: 3, fontWeight: 600, textTransform: 'none', bgcolor: view === 'bookmarks' ? '#42a5f5' : 'transparent', color: view === 'bookmarks' ? '#000' : '#e0e0e0', borderColor: '#42a5f5', boxShadow: view === 'bookmarks' ? '0 4px 14px rgba(158,158,158,0.4)' : 'none', '&:hover': { bgcolor: '#42a5f5', color: '#000', boxShadow: '0 6px 20px rgba(189,189,189,0.5)' } }}
            onClick={() => { setView('bookmarks'); setCurrentPage(1); }}
          >
            Bookmarked Prompts
          </Button>
        </Stack>

        {/* Animated Content */}
        <AnimatePresence mode="wait">
          {view === 'prompts' && (
            loadingPrompts 
            ? <ProfilePromptCardSkeleton />
            : <motion.div
                key="prompts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {prompts.length > 0 ? (
                  <Grid container spacing={3}>
                    {prompts.map((prompt) => (
                      <Grid item xs={12} key={prompt._id}>
                        <ProfilePromptCard
                          prompt={prompt}
                          onView={() => navigate(`/prompts/${prompt._id}`)}
                          onDelete={() => handleDeletePrompt(prompt._id)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Paper
                    elevation={3}
                    sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                    bgcolor: "#121212",
                    color: "#bbb",
                    }}
                  >
                    <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{ color: "#fff", mb: 1 }}
                    >
                      No prompts created yet.
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#aaa' }}>
                      You haven't created any prompts yet.
                    </Typography>
                  </Paper>
                )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => setCurrentPage(page)}
                    siblingCount={0}
                    boundaryCount={1}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#fff',           // default page color
                        borderColor: '#555',     // border for outlined items
                      },
                      '& .MuiPaginationItem-root.Mui-selected': {
                        bgcolor: '#42a5f5',     // selected page background
                        color: '#000',           // selected page text
                      },
                      '& .MuiPaginationItem-root:hover': {
                        bgcolor: 'rgba(66,165,245,0.2)', // hover background
                      },
                    }}
                  />
                </Box>

              )}
            </motion.div>
          )}

          {view === 'bookmarks' && (
            loadingBookmarks 
            ? <ProfilePromptCardSkeleton />
            : <motion.div
              key="bookmarks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {bookmarkedPrompts.length > 0 ? (
                <Grid container spacing={3}>
                {bookmarkedPrompts.map((prompt) => (
                  <Grid item xs={12} key={prompt._id}>
                    <ProfilePromptCard
                      prompt={prompt}
                      onView={() => navigate(`/prompts/${prompt._id}`)}
                      onRemoved={() => handleBookmarkRemoved(prompt._id)}
                    />
                  </Grid>
                ))}
                </Grid>
              ) : (
                <Paper
                  elevation={3}
                  sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 3,
                  bgcolor: "#121212",
                  color: "#bbb",
                  }}
                >
                  <Typography
                  variant="h6"
                  fontWeight="600"
                  sx={{ color: "#fff", mb: 1 }}
                  >
                    No prompts saved yet.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>
                    You haven't bookmarked any prompts yet.
                  </Typography>
                </Paper>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => setCurrentPage(page)}
                    siblingCount={0}
                    boundaryCount={1}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#e0e0e0', // light grey for normal pages
                        borderColor: 'rgba(255,255,255,0.1)', // subtle border
                      },
                      '& .MuiPaginationItem-root.Mui-selected': {
                        bgcolor: '#42a5f5', // blue selected background
                        color: '#000',       // black text on selected
                      },
                      '& .MuiPaginationItem-root:hover': {
                        bgcolor: 'rgba(66,165,245,0.2)', // subtle blue hover
                      },
                      '& .MuiPaginationItem-ellipsis': {
                        color: '#aaa', // ellipsis color
                      },
                    }}
                  />
                </Box>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default ProfilePage;
