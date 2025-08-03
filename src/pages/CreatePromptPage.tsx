import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Box } from '@mui/material';
import PromptForm from '../components/prompts/PromptForm';
import { createPrompt } from '../services/PromptService';
import { useAuth } from '../context/AuthContext';
import { CreatePromptDto } from '../models/Prompt';

const CreatePromptPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // useEffect is a better place for side-effects like navigation
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (data: CreatePromptDto) => {
    try {
      await createPrompt(data);
      navigate('/');
    } catch (error) {
      console.error('Failed to create prompt:', error);
      // Optionally, add user-facing error handling here (e.g., a snackbar)
    }
  };

  // Render null or a loader while checking auth to prevent flashing content
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ my: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom>
              Create New Prompt
            </Typography>
            <PromptForm onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default CreatePromptPage;