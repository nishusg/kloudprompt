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
  Alert,
  Divider,
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

  // Redirect if not authenticated
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

  if (!isAuthenticated) return null;

  return (
    <Box
      sx={{
        bgcolor: '#0a0a0a',
        minHeight: 'calc(100vh - 64px)',
        py: { xs: 4, sm: 6 },
        color: '#fff',
      }}
    >
      <Container maxWidth="md">
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                gap: 2,
              }}
            >
              <CreateIcon
                sx={{
                  fontSize: 50,
                  color: '#1877F2',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'rotate(-5deg) scale(1.05)' },
                }}
              />
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{
                  background: 'linear-gradient(90deg, #1877F2, #0d47a1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: 1,
                }}
              >
                Create Prompt
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ color: 'grey.400', mb: 3, maxWidth: 600 }}>
              Craft a detailed and effective prompt. Provide a clear title, a concise
              description, and specific content to guide the AI. Use tags to help
              others discover your creation.
            </Typography>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 4 }} />

            {/* Form */}
            <Paper
              elevation={8}
              sx={{
                p: { xs: 2.5, sm: 4 },
                borderRadius: 3,
                bgcolor: 'rgba(18, 18, 18, 0.9)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
                },
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
