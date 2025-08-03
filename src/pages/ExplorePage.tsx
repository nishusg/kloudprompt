import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import { getPrompts } from '../services/PromptService'; // Import your real service
import { Prompt } from '../models/Prompt'; // Import your real Prompt model

/**
 * Reusable card component that is now a clickable link.
 */
const PromptCard: React.FC<{ prompt: Prompt }> = ({ prompt }) => {
  return (
    // The Grid item should wrap the card for proper spacing and layout
    <Grid >
      <Card
        component={RouterLink}
        to={`/prompts/${prompt._id}`} // Link to the prompt detail page
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          textDecoration: 'none', // Remove underline from link
          transition: 'box-shadow 0.3s, transform 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 8,
          },
        }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
            {prompt.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
            {prompt.promptText}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {/* Assuming the author object is populated from the backend */}
            by @{prompt.author?.username || 'Unknown'}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

/**
 * The main Explore component, now fetching live data.
 */
const ExplorePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]); // Stores the master list from API
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]); // Stores the list to display
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Effect to fetch all prompts ONCE on component mount
  useEffect(() => {
    const fetchAllPrompts = async () => {
      try {
        setLoading(true);
        const promptsData = await getPrompts(); // Your service to fetch all prompts
        setAllPrompts(promptsData);
        setFilteredPrompts(promptsData); // Initially, the filtered list is the full list
      } catch (err) {
        setError('Failed to load prompts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPrompts();
  }, []);

  // 2. Effect to filter prompts whenever the search term or master list changes
  useEffect(() => {
    if (!allPrompts) return; // Add a guard clause
    const results = allPrompts.filter(prompt => {
      const lowercasedSearchTerm = searchTerm.toLowerCase();

      // Check title (exists)
      const titleMatch = prompt.title.toLowerCase().includes(lowercasedSearchTerm);

      // Check promptText (instead of content)
      const contentMatch = prompt.promptText.toLowerCase().includes(lowercasedSearchTerm);

      // Check tags (optional but good to have)
      const tagMatch = prompt.tags.some(tag => 
        tag.toLowerCase().includes(lowercasedSearchTerm)
      );

      return titleMatch || contentMatch || tagMatch;
    });

    setFilteredPrompts(results);
  }, [searchTerm, allPrompts]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      {/* Header and Search Input (No changes needed) */}
      <Box textAlign="center" mb={{ xs: 5, md: 10 }}>
        {/* ... */}
      </Box>
      <Box display="flex" justifyContent="center" mb={{ xs: 5, md: 10 }}>
        {/* ... */}
      </Box>

      {/* Prompts Grid with Loading/Error states */}
      {loading ? (
        <Box display="flex" justifyContent="center"><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={4}>
          {filteredPrompts.length > 0 ? (
            filteredPrompts.map(prompt => (
              <PromptCard key={prompt._id} prompt={prompt} />
            ))
          ) : (
            <Grid> {/* Ensure this is also a Grid item for proper layout */}
              <Typography align="center" color="text.secondary" sx={{ mt: 4, fontStyle: 'italic' }}>
                No prompts found for "{searchTerm}". Try another keyword!
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default ExplorePage;