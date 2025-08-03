import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Services, Models, and Constants
import { getPrompts, getPopularTags } from '../services/PromptService';
import { Prompt } from '../models/Prompt';
import { Popular } from '../utils/Constants';

// Components
import PromptCard from '../components/prompts/PromptCard';

// MUI Imports
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';

const HomePage: React.FC = () => {
  // ✅ Set initial state to empty arrays
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // getPrompts returns a pagination object, getPopularTags returns an array
        const [promptsData, tagsData] = await Promise.all([
          getPrompts({ sort: Popular, limit: 9 }),
          getPopularTags(),
        ]);

        // ✅ Correctly access the .data property for prompts
        setPrompts(promptsData);
        setTags(tagsData);

      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePromptClick = (id: string) => {
    navigate(`/prompts/${id}`);
  };

  const handleTagClick = (tag: string) => {
    // Assuming you have a route for viewing tags
    navigate(`/explore?tag=${tag}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ... Hero Section (No changes needed) ... */}
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Discover Prompts
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Find and share the best prompts for AI tools
        </Typography>
      </Box>

      {/* ... Popular Tags Section (No changes needed) ... */}
      <Box sx={{ mb: 5 }}>
        {/* ... */}
      </Box>

      {/* --- FEATURED PROMPTS SECTION --- */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" component="h2" fontWeight="600" gutterBottom>
          Featured Prompts
        </Typography>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3}>
            {prompts.map((prompt) => (
              // ✅ Corrected: Added 'item' prop and responsive sizing
              <Grid key={prompt._id}>
                <PromptCard
                  prompt={prompt}
                  onClick={() => handlePromptClick(prompt._id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;