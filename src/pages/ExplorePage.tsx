import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Box,
  Grid,
  Card,
  CardContent,
} from '@mui/material';

// Mock data for prompts - in a real app, this would come from an API
const mockPrompts = [
  { id: 1, title: 'Epic Landscape Photography', description: 'Generate a prompt for creating breathtaking mountain landscapes at sunset.', author: 'PixelArtisan' },
  { id: 2, title: 'Sci-Fi Character Concept', description: 'A detailed prompt for designing a futuristic bounty hunter with cybernetic enhancements.', author: 'CyberCreator' },
  { id: 3, title: 'Minimalist Logo Design', description: 'Create a prompt for a modern, clean logo for a tech startup.', author: 'DesignFuel' },
  { id: 4, title: 'Story Writing Starter', description: 'A prompt to kickstart a fantasy short story involving a lost magical artifact.', author: 'StoryWeaver' },
  { id: 5, title: 'Healthy Meal Plan', description: 'Generate a week-long healthy and delicious meal plan for a busy professional.', author: 'NutriGen' },
  { id: 6, title: '3D Architectural Visualization', description: 'A prompt for rendering a photorealistic modern beach house using Blender.', author: 'ArchVizPro' },
];

// A reusable card component for displaying each prompt, now using MUI Card
const PromptCard: React.FC<{ title: string; description: string; author: string }> = ({ title, description, author }) => {
  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 0.3s, transform 0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 8, // Elevates the card on hover
      },
    }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
          {description}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          by @{author}
        </Typography>
      </CardContent>
    </Card>
  );
};

// The main Explore component, now using MUI components
const Explore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPrompts, setFilteredPrompts] = useState(mockPrompts);

  useEffect(() => {
    const results = mockPrompts.filter(prompt =>
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPrompts(results);
  }, [searchTerm]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      {/* Header */}
      <Box textAlign="center" mb={{ xs: 5, md: 10 }}>
        <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
          Explore Prompts 🚀
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover and find the perfect prompt for your next project.
        </Typography>
      </Box>

      {/* Search Input */}
      <Box display="flex" justifyContent="center" mb={{ xs: 5, md: 10 }}>
        <TextField
          label="Search for prompts by keyword..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '100%', maxWidth: '600px' }}
        />
      </Box>

      {/* Prompts Grid */}
      <Grid container spacing={4}>
        {filteredPrompts.length > 0 ? (
          filteredPrompts.map(prompt => (
            <Grid key={prompt.id}>
              <PromptCard
                title={prompt.title}
                description={prompt.description}
                author={prompt.author}
              />
            </Grid>
          ))
        ) : (
          <Grid>
            <Typography align="center" color="text.secondary" sx={{ mt: 4, fontStyle: 'italic' }}>
              No prompts found for "{searchTerm}". Try another keyword!
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Explore;