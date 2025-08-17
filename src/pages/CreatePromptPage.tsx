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
    } catch (error: any) {
      console.error("Failed to create prompt:", error);

      // 🔹 If backend sent a proper JSON error
      if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } 
      // 🔹 Fallback to default error message
      else if (error instanceof Error) {
        setSubmitError(error.message);
      } 
      else {
        setSubmitError("An unknown error occurred. Please try again.");
      }
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
      <Container maxWidth="lg">
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
                  color: '#42a5f5',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'rotate(-5deg) scale(1.05)' },
                }}
              />
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{
                  background: '#42a5f5',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: 1,
                }}
              >
                Create Prompt
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ color: 'grey.400', mb: 3, maxWidth: 800 }}>
              Craft a detailed and effective prompt. Provide a clear title, a concise
              description, and specific content to guide the AI. Use tags to help
              others discover your creation.
            </Typography>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 4 }} />

            {/* Form */}
            <Paper
              sx={{
                borderRadius: 3,
                bgcolor: '#0a0a0a',
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
