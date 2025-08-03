import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Use our global auth hook
import { getUserPrompts, deletePrompt } from '../services/PromptService'; // Import your real services
import { User, Prompt } from '../models'; // Assuming models are in src/models

// MUI Imports
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

// --- PROMPT CARD COMPONENT (with Edit/Delete) ---
// We've updated this component to accept edit and delete handlers
const PromptCard: React.FC<{
  prompt: Prompt;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ prompt, onEdit, onDelete }) => {
  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {prompt.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {prompt.promptText} {/* Assuming the field is 'content' */}
        </Typography>
      </CardContent>
      <CardActions sx={{ pl: 2, pb: 2, justifyContent: 'space-between' }}>
        {/* We can add buttons for edit and delete here */}
        <Button size="small" onClick={onEdit}>Edit</Button>
        <Button size="small" color="error" onClick={onDelete}>Delete</Button>
      </CardActions>
    </Card>
  );
};

// --- PROFILE PAGE COMPONENT ---
const ProfilePage: React.FC = () => {
  const { user: loggedInUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(true);

  useEffect(() => {
    // Fetch the user's prompts when the component mounts and the user is logged in
    const fetchUserPrompts = async () => {
      if (loggedInUser?._id) {
        try {
          setLoadingPrompts(true);
          const userPrompts = await getUserPrompts(loggedInUser._id);
          setPrompts(userPrompts);
        } catch (error) {
          console.error("Failed to fetch user prompts:", error);
        } finally {
          setLoadingPrompts(false);
        }
      }
    };

    if (!authLoading) {
        fetchUserPrompts();
    }
  }, [loggedInUser, authLoading]); // Re-run if the user logs in or out

  const handleEdit = (promptId: string) => {
    navigate(`/update-prompt/${promptId}`);
  };

  const handleDelete = async (promptId: string) => {
    const hasConfirmed = window.confirm("Are you sure you want to delete this prompt?");
    if (hasConfirmed) {
      try {
        await deletePrompt(promptId);
        // Update the state to remove the prompt from the UI instantly
        setPrompts((prevPrompts) => prevPrompts.filter((p) => p._id !== promptId));
      } catch (error) {
        console.error("Failed to delete prompt:", error);
      }
    }
  };

  // Show a loading spinner while authenticating or fetching prompts
  if (authLoading || loadingPrompts) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Profile...</Typography>
      </Box>
    );
  }

  // If not loading and no user is logged in, prompt to log in
  if (!loggedInUser) {
    return <Typography variant="h6" align="center" sx={{ mt: 4 }}>Please log in to view your profile.</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: '12px' }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          alignItems={{ xs: 'center', md: 'flex-start' }}
        >
          <Avatar
            src={loggedInUser.avatar}
            alt={loggedInUser.username}
            sx={{ width: 96, height: 96 }}
          />
          <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left'} }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {loggedInUser.username}
            </Typography>
            {/* Show an "Edit Profile" button instead of Follow */}
            <Button variant="outlined" size="medium" sx={{ mt: 2, width: { xs: '100%', sm: 'auto' }}}>
              Edit Profile
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
        My Prompts
      </Typography>

      <Grid container spacing={3}>
        {prompts.length > 0 ? (
          prompts.map((prompt) => (
            // ✅ Corrected Grid layout and key prop
            <Grid key={prompt._id}>
              <PromptCard
                prompt={prompt}
                onEdit={() => handleEdit(prompt._id)}
                onDelete={() => handleDelete(prompt._id)}
              />
            </Grid>
          ))
        ) : (
          <Typography sx={{ ml: 3, mt: 2, color: 'text.secondary' }}>You haven't created any prompts yet.</Typography>
        )}
      </Grid>
    </Container>
  );
};

export default ProfilePage;