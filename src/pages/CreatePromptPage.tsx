// src/pages/CreatePromptPage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create'; // Import an icon

import PromptForm from '../components/prompts/PromptForm';
import { createPrompt } from '../services/PromptService';
import { useAuth } from '../context/AuthContext';
import { CreatePromptDto } from '../models/Prompt';

const CreatePromptPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Redirect if not authenticated after auth check is complete
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (data: CreatePromptDto) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // On success, navigate to the newly created prompt's detail page
      const newPrompt = await createPrompt(data);
      navigate(`/prompts/${newPrompt._id}`);
    } catch (error) {
      console.error('Failed to create prompt:', error);
      setSubmitError(error instanceof Error ? error.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show a loader while checking auth status
  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // This check prevents flashing the form before redirecting
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: 'calc(100vh - 64px)' }}>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={4}>
          {/* --- Left Column: Title and Instructions --- */}
          <Grid >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CreateIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h4" component="h1" fontWeight="bold">
                Create Prompt
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Craft a detailed and effective prompt. Provide a clear title, a concise description, and specific content to guide the AI. Use tags to help others discover your creation.
            </Typography>
          </Grid>

          {/* --- Right Column: The Form --- */}
          <Grid >
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
              {submitError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {submitError}
                </Alert>
              )}
              <PromptForm
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CreatePromptPage;
