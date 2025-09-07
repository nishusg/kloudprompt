// src/pages/UserProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Avatar,
  Stack,
  Link,
  Chip,
} from '@mui/material';
import { getUserById, getUserPrompts, getUserStats } from '../../services/UserService';
import { User, UserStats } from '../../models/User';
import { Prompt } from '../../models/Prompt';
import ProfilePromptCard from '../../components/prompts/ProfilePromptCard';
import { DefaultUserName } from '../../utils/Constants';
import { VerificationStatus } from '../../utils/Enum';

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>();

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [userData, userPrompts, stats] = await Promise.all([
          getUserById(userId),
          getUserPrompts(userId),
          getUserStats(userId)
        ]);
        setUser(userData);
        setPrompts(userPrompts);
        setUserStats(stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading)
    return (
      <CircularProgress
        sx={{ display: 'block', mx: 'auto', mt: 10, color: '#42a5f5' }}
      />
    );

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

              {/* Email */}
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
                  {/* Verification Chip */}
                  {user.verificationStatus && (
                    <Chip
                      label={user.verificationStatus === VerificationStatus.Verified ? "Verified" : "Pending"}
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

        <Box sx={{ display: 'flex', gap: 3, mt: 2, mb: 3 }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              textAlign: 'center',
              flex: 1,
              bgcolor: '#121212',
              color: '#fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
            }}
          >
            <Typography variant="h6" color="#aaa">
              Total Prompts
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {userStats?.totalPrompts || 0}
            </Typography>
          </Paper>

          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              textAlign: 'center',
              flex: 1,
              bgcolor: '#121212',
              color: '#fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
            }}
          >
            <Typography variant="h6" color="#aaa">
              Total Views
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {userStats?.totalViews || 0}
            </Typography>
          </Paper>
        </Box>

        {/* User Prompts */}
        <Typography variant="h6" sx={{ mb: 2, color: '#90caf9' }}>
          Prompts by {user.userName}
        </Typography>

        {prompts.length === 0 ? (
          <Typography sx={{ color: '#bbb' }}>No prompts found.</Typography>
        ) : (
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
        )}
      </Container>
    </Box>
  );
};

export default UserProfilePage;
