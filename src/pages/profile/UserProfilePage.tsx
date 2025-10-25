import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Stack,
  Link,
  Chip,
  Pagination,
} from '@mui/material';
import { getUserById, getUserPrompts, getUserStats } from '../../services/UserService';
import { User, UserStats } from '../../models/User';
import { Prompt } from '../../models/Prompt';
import ProfilePromptCard from '../../components/prompts/ProfilePromptCard';
import { DefaultUserName } from '../../utils/Constants';
import { VerificationStatus } from '../../utils/Enum';
import UserProfileSkeleton from '../../components/skeleton/UserProfileSkeleton';
import ProfilePromptCardSkeleton from '../../components/skeleton/ProfilePromptCardSkeleton';

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get("page") || "1", 10);

  const [user, setUser] = useState<User | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPrompts, setLoadingPrompts] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  const PAGE_LIMIT = 5;

  // Fetch user info and stats once
  const fetchUserData = async () => {
    if (!userId) return;
    setLoadingUser(true);
    try {
      const [userData, stats] = await Promise.all([
        getUserById(userId),
        getUserStats(userId),
      ]);
      setUser(userData);
      setUserStats(stats);
    } catch (err: any) {
      console.error(err?.message);
    } finally {
      setLoadingUser(false);
    }
  };

  // Fetch prompts whenever page changes
  const fetchPrompts = async (page = 1) => {
    if (!userId) return;
    setLoadingPrompts(true);
    try {
      const { prompts, totalPages } = await getUserPrompts(userId, page, PAGE_LIMIT);
      setPrompts(prompts);
      setTotalPages(totalPages || 1);
    } catch (err: any) {
      console.error(err?.message);
    } finally {
      setLoadingPrompts(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    fetchPrompts(currentPage);
  }, [userId, currentPage]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    navigate(`/users/${userId}?page=${page}`);
  };

  if (loadingUser)
    return <UserProfileSkeleton />;

  if (!user)
    return (
      <Typography sx={{ textAlign: 'center', mt: 10, color: '#fff' }}>
        User not found
      </Typography>
    );

  return (
    <Box sx={{ bgcolor: '#0a0a0a', color: '#fff', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        {/* User Info */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: '#111', borderRadius: 2 }}>
          <Stack direction="row" spacing={{ xs: 2, md: 3 }} alignItems="center">
            <Avatar
              alt={user.userName || DefaultUserName}
              sx={{
                width: { xs: 80, sm: 90, md: 100 },
                height: { xs: 80, sm: 90, md: 100 },
                bgcolor: '#42a5f5',
                color: '#fff',
                fontSize: '2rem',
              }}
            >
              {(user.userName || DefaultUserName).charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#fff' }}>
                {user.userName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#bbb' }}>
                Joined on {new Date(user.createdAt).toLocaleDateString()}
              </Typography>

              {/* Email & Verification */}
              {user.email && (
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
                  {user.email}
                  {user.verificationStatus && (
                    <Chip
                      label={user.verificationStatus === VerificationStatus.Verified ? VerificationStatus.Verified : VerificationStatus.Pending}
                      size="small"
                      color={user.verificationStatus === VerificationStatus.Verified ? "success" : "error"}
                      sx={{ fontSize: '0.60rem' }}
                    />
                  )}
                </Typography>
              )}

              {/* Optional Fields */}
              {user.fullName && (
                <Typography variant="body2" sx={{ color: '#bbb' }}>
                  {user.fullName}
                </Typography>
              )}
              {user.phone && (
                <Typography variant="body2" sx={{ color: '#bbb' }}>
                  {user.phone}
                </Typography>
              )}
              {user.bio && (
                <Typography variant="body2" sx={{ color: '#bbb', mt: 1 }}>
                  {user.bio}
                </Typography>
              )}

              {/* Social Links */}
              {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
                <Stack spacing={1} mt={1}>
                  {Object.entries(user.socialLinks).map(([platform, url]) =>
                    url ? (
                      <Stack
                        key={platform}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: '#aaa', fontWeight: 600, minWidth: 80 }}
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </Typography>
                        <Link
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: '#42a5f5',
                            textDecoration: 'none',
                            wordBreak: 'break-all',
                          }}
                        >
                          link
                        </Link>
                      </Stack>
                    ) : null
                  )}
                </Stack>
              )}
            </Box>
          </Stack>
        </Paper>

        {/* User Stats */}
        <Box sx={{ display: 'flex', gap: 3, mt: 2, mb: 3 }}>
          <Paper sx={{
            p: 2, borderRadius: 2, textAlign: 'center',
            flex: 1, bgcolor: '#121212', color: '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
          }}>
            <Typography variant="h6" color="#aaa">Total Prompts</Typography>
            <Typography variant="h5" fontWeight="bold">{userStats?.totalPrompts || 0}</Typography>
          </Paper>

          <Paper sx={{
            p: 2, borderRadius: 2, textAlign: 'center',
            flex: 1, bgcolor: '#121212', color: '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
          }}>
            <Typography variant="h6" color="#aaa">Total Views</Typography>
            <Typography variant="h5" fontWeight="bold">{userStats?.totalViews || 0}</Typography>
          </Paper>
        </Box>

        {/* User Prompts */}
        <Typography variant="h6" sx={{ mb: 2, color: '#90caf9' }}>
          Top {PAGE_LIMIT} prompts
        </Typography>

        {loadingPrompts
        ? <ProfilePromptCardSkeleton />
        : prompts.length === 0 ? (
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              bgcolor: "#121212",
              color: "#bbb",
              border: "1px dashed rgba(144,202,249,0.3)",
              opacity: 0.6
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
        ) : (
          <>
            <Grid container spacing={3}>
              {prompts.map((prompt) => (
                <Grid item xs={12} key={prompt._id}>
                  <ProfilePromptCard
                    prompt={prompt}
                    onView={() => navigate(`/prompts/${prompt._id}`)}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && 
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  siblingCount={0}
                  boundaryCount={1}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#fff",
                    },
                    "& .Mui-selected": {
                      bgcolor: "#42a5f5 !important",
                      color: "#000",
                    },
                  }}
                />
              </Box>
            }
          </>
        )}
      </Container>
    </Box>
  );
};

export default UserProfilePage;
