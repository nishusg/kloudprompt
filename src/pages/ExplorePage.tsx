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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination
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
          backgroundColor: 'rgba(30, 30, 30, 0.85)',
          color: '#fff',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
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
            by @{prompt.author?.userName || 'Unknown'}
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

  const [modelType, setModelType] = useState<string | null>(null);
  const [generationType, setGenerationType] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 9; // 3 rows per page

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
      const contentMatch = prompt.content.toLowerCase().includes(lowerTerm);

      const matchesModelType = !modelType || prompt.modelType === modelType;
      const matchesGenerationType =
        !generationType || prompt.generationType === generationType;

      return (titleMatch || contentMatch) && matchesModelType && matchesGenerationType;
    });

    setFilteredPrompts(results);
    setPage(1); // Reset to first page when filters/search change
  }, [searchTerm, allPrompts, modelType, generationType]);

  // Paginated data
  const paginatedPrompts = filteredPrompts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
  <Box
    sx={{
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      overflowX: 'hidden',
      minHeight: '90vh',          // ✅ Always fill viewport height
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* Everything above footer is wrapped in flex:1 */}
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          textAlign: 'center',
          background: 'linear-gradient(135deg, #111111, #000000)',
          color: '#fff',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Explore Prompts
        </Typography>
        <Typography variant="body1" color="grey.400" maxWidth="sm" mx="auto">
          Discover creative prompts shared by the community. Search by keyword, model type, or generation type.
        </Typography>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 }, flex: 1 }}>
        {/* Search */}
        <Paper
          elevation={3}
          sx={{
            maxWidth: 500,
            mx: 'auto',
            mb: 3,
            p: 1,
            borderRadius: 50,
            backgroundColor: 'rgba(40, 40, 40, 0.8)',
            backdropFilter: 'blur(6px)',
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
                  <IconButton
                    onClick={() => setSearchTerm('')}
                    size="small"
                    sx={{ color: '#fff' }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              px: 2,
              color: '#fff',
              '& .MuiInputBase-input': { color: '#fff' },
              '& .MuiInputBase-input::placeholder': {
                color: '#fff',
                opacity: 0.8,
              },
            }}
          />
        </Paper>

        {/* Filters */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 4,
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
            flexWrap: 'wrap',
          }}
        >
          {/* Model Type Filter */}
          <FormControl sx={{ minWidth: 200 }} variant="outlined" size="small">
            <InputLabel sx={{ color: '#ccc', fontWeight: 500 }}>
              Model Type
            </InputLabel>
            <Select
              value={modelType || ''}
              onChange={(e) => setModelType(e.target.value || null)}
              label="Model Type"
              sx={{
                bgcolor: 'rgba(40, 40, 40, 0.8)',
                borderRadius: '12px',
                color: '#fff',
                fontWeight: 500,
                backdropFilter: 'blur(8px)',
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="gemini">Gemini</MenuItem>
              <MenuItem value="chatgpt">ChatGPT</MenuItem>
              <MenuItem value="grok">Grok</MenuItem>
            </Select>
          </FormControl>

          {/* Generation Type Filter */}
          <FormControl sx={{ minWidth: 200 }} variant="outlined" size="small">
            <InputLabel sx={{ color: '#ccc', fontWeight: 500 }}>
              Generation Type
            </InputLabel>
            <Select
              value={generationType || ''}
              onChange={(e) => setGenerationType(e.target.value || null)}
              label="Generation Type"
              sx={{
                bgcolor: 'rgba(40, 40, 40, 0.8)',
                borderRadius: '12px',
                color: '#fff',
                fontWeight: 500,
                backdropFilter: 'blur(8px)',
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="image">🖼️ Image</MenuItem>
              <MenuItem value="video">🎥 Video</MenuItem>
              <MenuItem value="text">📄 Text</MenuItem>
              <MenuItem value="audio">🎵 Audio</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Results */}
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress sx={{ color: '#fff' }} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <Grid container spacing={4}>
              {paginatedPrompts.length > 0 ? (
                paginatedPrompts.map((prompt) => (
                  <PromptCard key={prompt._id} prompt={prompt} />
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography
                    align="center"
                    color="grey.500"
                    sx={{ mt: 4, fontStyle: 'italic' }}
                  >
                    No prompts found. Try changing your search or filters!
                  </Typography>
                </Grid>
              )}
            </Grid>

            {/* Pagination */}
            {filteredPrompts.length > rowsPerPage && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={Math.ceil(filteredPrompts.length / rowsPerPage)}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#fff',
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  </Box>
);
};


export default ExplorePage;
