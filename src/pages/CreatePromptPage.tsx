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
import CreateIcon from '@mui/icons-material/Create';
import PromptForm from '../components/prompts/PromptForm';
import { createPrompt } from '../services/PromptService';
import { useAuth } from '../context/AuthContext';
import { CreatePromptDto } from '../models/Prompt';

const CreatePromptPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Redirect if not authenticated after auth check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (data: CreatePromptDto) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const newPrompt = await createPrompt(data);
      navigate(`/prompts/${newPrompt._id}`);
    } catch (error) {
      console.error('Failed to create prompt:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'An unknown error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10, bgcolor: '#000' }}>
        <CircularProgress sx={{ color: '#fff' }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box
      sx={{
        bgcolor: '#000',
        minHeight: 'calc(100vh - 64px)',
        py: 6,
        color: '#fff',
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={4} justifyContent="center">
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CreateIcon sx={{ fontSize: 48, color: '#1877F2', mr: 2 }} />
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                sx={{
                  background: 'linear-gradient(90deg, #1877F2, #0d47a1)', // FB blue to darker blue
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Create Prompt
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ color: 'grey.400', mb: 4 }}
            >
              Craft a detailed and effective prompt. Provide a clear title, a
              concise description, and specific content to guide the AI. Use
              tags to help others discover your creation.
            </Typography>

            <Paper
              elevation={6}
              sx={{
                p: { xs: 2, sm: 4 },
                borderRadius: 3,
                bgcolor: '#121212',
              }}
            >
              {submitError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {submitError}
                </Alert>
              )}
              <PromptForm onSubmit={handleSubmit} isLoading={isSubmitting} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CreatePromptPage;
