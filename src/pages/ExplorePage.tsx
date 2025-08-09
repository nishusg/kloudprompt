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
            {prompt.promptText}
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

  useEffect(() => {
    const fetchAllPrompts = async () => {
      try {
        setLoading(true);
        const promptsData = await getPrompts();
        setAllPrompts(promptsData);
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
      const contentMatch = prompt.promptText.toLowerCase().includes(lowerTerm);
      const tagMatch = prompt.tags.some((tag) =>
        tag.toLowerCase().includes(lowerTerm)
      );
      return titleMatch || contentMatch || tagMatch;
    });
    setFilteredPrompts(results);
  }, [searchTerm, allPrompts]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        pb: 8,
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          textAlign: 'center',
          background:
            'linear-gradient(135deg, #111111, #000000)',
          color: '#fff',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Explore Prompts
        </Typography>
        <Typography variant="body1" color="grey.400" maxWidth="sm" mx="auto">
          Discover creative prompts shared by the community. Search by keyword, title, or tags.
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        {/* Search Bar */}
        <Paper
          elevation={3}
          sx={{
            maxWidth: 500,
            mx: 'auto',
            mb: 6,
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

        {/* Content Grid */}
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
                  No prompts found for "{searchTerm}". Try another keyword!
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
