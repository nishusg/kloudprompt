// src/pages/UserProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Paper, Grid, CircularProgress, Avatar, Stack
} from '@mui/material';
import { getUserById, getUserPrompts } from '../../services/UserService';
import { User } from '../../models/User';
import { Prompt } from '../../models/Prompt';
import ProfilePromptCard from '../../components/prompts/ProfilePromptCard';
import { DefaultUserName } from '../../utils/Constants';

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [userData, userPrompts] = await Promise.all([
          getUserById(userId),
          getUserPrompts(userId),
        ]);
        setUser(userData);
        setPrompts(userPrompts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading)
    return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 10, color: '#42a5f5' }} />;

  if (!user)
    return <Typography sx={{ textAlign: 'center', mt: 10, color: '#fff' }}>User not found</Typography>;

  return (
    <Box sx={{ bgcolor: '#0a0a0a', color: '#fff', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        {/* User Info */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: '#111', borderRadius: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 64, height: 64, bgcolor: '#42a5f5', color: '#fff' }}>
              {(user.userName || DefaultUserName).charAt(0).toUpperCase()}              
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#fff' }}>{user.userName}</Typography>
              <Typography variant="body2" sx={{ color: '#bbb' }}>
                Joined on {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
              {user.email && (
                <Typography variant="body2" sx={{ color: '#bbb' }}>
                  {user.email}
                </Typography>
              )}
            </Box>
          </Stack>
        </Paper>

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
