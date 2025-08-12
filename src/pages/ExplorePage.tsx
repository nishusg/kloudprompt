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
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { getPrompts } from '../services/PromptService';
import { Prompt } from '../models/Prompt';

const PromptCard: React.FC<{ prompt: Prompt }> = ({ prompt }) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        component={RouterLink}
        to={`/prompts/${prompt._id}`}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          textDecoration: 'none',
          borderRadius: 3,
          backgroundColor: 'rgba(30, 30, 30, 0.9)',
          color: '#fff',
          transition: 'all 0.3s ease',
          boxShadow: 4,
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: 8,
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
            {prompt.title}
          </Typography>
          <Typography
            variant="body2"
            color="grey.400"
            sx={{
              flexGrow: 1,
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {prompt.content}
          </Typography>
          <Typography variant="caption" color="grey.500">
            by @{prompt.author?.username || 'Unknown'}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

const ExplorePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllPrompts = async () => {
      try {
        setLoading(true);
        const promptsData = await getPrompts();
        setAllPrompts(promptsData);

        // Extract unique tags
        const tagsSet = new Set<string>();
        promptsData.forEach(p => p.tags?.forEach(tag => tagsSet.add(tag)));
        setAllTags(Array.from(tagsSet));

        setFilteredPrompts(promptsData);
      } catch (err) {
        setError('Failed to load prompts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllPrompts();
  }, []);

  useEffect(() => {
    if (!allPrompts) return;
    const lowerTerm = searchTerm.toLowerCase();

    const results = allPrompts.filter((prompt) => {
      const titleMatch = prompt.title.toLowerCase().includes(lowerTerm);
      const contentMatch = prompt.content.toLowerCase().includes(lowerTerm);
      const tagMatch = prompt.tags.some((tag) =>
        tag.toLowerCase().includes(lowerTerm)
      );

      // Tag filter logic
      const matchesSelectedTags =
        selectedTags.length === 0 ||
        selectedTags.every(tag => prompt.tags.includes(tag));

      return (titleMatch || contentMatch || tagMatch) && matchesSelectedTags;
    });

    setFilteredPrompts(results);
  }, [searchTerm, allPrompts, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      overflowX: 'hidden', // stops horizontal scroll
      }}>
      {/* Header */}
      <Box sx={{
        py: { xs: 6, md: 8 },
        textAlign: 'center',
        background: 'linear-gradient(135deg, #111111, #000000)',
        color: '#fff',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Explore Prompts
        </Typography>
        <Typography variant="body1" color="grey.400" maxWidth="sm" mx="auto">
          Discover creative prompts shared by the community. Search by keyword, title, or tags.
        </Typography>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
        {/* Search */}
        <Paper
          elevation={3}
          sx={{
            maxWidth: 500,
            mx: 'auto',
            mb: 3,
            p: 1,
            borderRadius: 50,
            backgroundColor: 'rgba(40, 40, 40, 0.95)',
          }}
        >
          <TextField
            fullWidth
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#fff' }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchTerm('')} size="small" sx={{ color: '#fff' }}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              px: 2,
              color: '#fff',
              '& .MuiInputBase-input': { color: '#fff' },
              '& .MuiInputBase-input::placeholder': { color: '#fff', opacity: 1 }
            }}
          />
        </Paper>

        {/* Tag Filter */}
        <Box
          sx={{
            display: 'flex',
            overflowX: { xs: 'auto', md: 'visible' }, // Scroll on small, no scroll on large
            whiteSpace: 'nowrap',
            justifyContent: { xs: 'flex-start', md: 'center' }, // Align left on mobile, center on large
            flexWrap: { xs: 'nowrap', md: 'wrap' }, // Wrap tags on large screens
            p: 1,
            mb: 4,
            '&::-webkit-scrollbar': {
              height: 6,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: 3,
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#1976d2',
            },
          }}
        >
          {allTags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => toggleTag(tag)}
              sx={{
                mr: 1,
                mb: { md: 1, xs: 0 },
                cursor: 'pointer',
                backgroundColor: selectedTags.includes(tag)
                  ? '#1976d2'
                  : 'rgba(255,255,255,0.1)',
                color: '#fff',
                '&:hover': { backgroundColor: '#1976d2' }
              }}
            />
          ))}
        </Box>
        
        {/* Results */}
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress sx={{ color: '#fff' }} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={4}>
            {filteredPrompts.length > 0 ? (
              filteredPrompts.map((prompt) => (
                <PromptCard key={prompt._id} prompt={prompt} />
              ))
            ) : (
              <Grid item xs={12}>
                <Typography
                  align="center"
                  color="grey.500"
                  sx={{ mt: 4, fontStyle: 'italic' }}
                >
                  No prompts found. Try changing your search or tag filter!
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ExplorePage;
