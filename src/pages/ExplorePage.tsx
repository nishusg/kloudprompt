import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Button,
  Skeleton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { getPrompts } from '../services/PromptService';
import { Prompt } from '../models/Prompt';
import ExplorePromptCard from '../components/prompts/ExplorePromptCard';
import { GenerationTypeEnum, ProviderTypeEnum, PromptCategoryEnum } from '../utils/Enum';

const ExplorePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modelType, setModelType] = useState<string | null>(null);
  const [generationType, setGenerationType] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null); // ✅ NEW state

  const [page, setPage] = useState(1);
  const rowsPerPage = 9;

  // Debounced search state
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

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
    const lowerTerm = debouncedSearch.toLowerCase();

    const results = allPrompts.filter((prompt) => {
      const titleMatch = prompt.title.toLowerCase().includes(lowerTerm);
      const contentMatch = prompt.content.toLowerCase().includes(lowerTerm);
      const matchesModelType = !modelType || prompt.modelType === modelType;
      const matchesGenerationType =
        !generationType || prompt.generationType === generationType;
      const matchesCategory = !category || prompt.category === category;

      return (titleMatch || contentMatch) && matchesModelType && matchesGenerationType && matchesCategory;
    });

    setFilteredPrompts(results);
    setPage(1);
  }, [debouncedSearch, allPrompts, modelType, generationType, category]);

  const paginatedPrompts = filteredPrompts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box
      sx={{
        background: '#0a0a0a',
        overflowX: 'hidden',
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            py: { xs: 6, md: 8 },
            px: { xs: 2, sm: 4 },
            textAlign: 'center',
            background: '#0a0a0a',
            color: '#fff',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Explore Prompts
          </Typography>
          <Typography
            variant="body1"
            color="grey.400"
            sx={{
              maxWidth: { xs: "100%", sm: "600px" },
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Discover creative prompts shared by the community. Search by keyword, model type, generation type, or category.
          </Typography>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, flex: 1 }}>
          {/* Search */}
          <Paper
            elevation={3}
            sx={{
              maxWidth: 500,
              mx: 'auto',
              mb: 3,
              p: 1,
              borderRadius: 50,
              backgroundColor: '#121212',
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
              textAlign: "center",
              mb: 4,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" }, // ✅ stacked on mobile, row on larger screens
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
              alignItems: { xs: "stretch", sm: "center" }, // full width on mobile
            }}
          >
            {/* Model Type */}
            <FormControl
              sx={{ minWidth: { xs: "100%", sm: 160, md: 200 } }} // ✅ full width on mobile
              size="small"
            >
              <InputLabel sx={{ color: "#ccc" }}>Model Type</InputLabel>
              <Select
                value={modelType || ""}
                onChange={(e) => setModelType(e.target.value || null)}
                sx={{
                  bgcolor: "#121212",
                  borderRadius: "12px",
                  color: "#fff",
                  "& .MuiSelect-icon": { color: "#fff" },
                }}
                MenuProps={{
                  PaperProps: { sx: { bgcolor: "#121212", color: "#fff" } },
                  disableScrollLock: true,
                }}
              >
                <MenuItem value="">All</MenuItem>
                {Object.values(ProviderTypeEnum).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Generation Type */}
            <FormControl
              sx={{ minWidth: { xs: "100%", sm: 160, md: 200 } }}
              size="small"
            >
              <InputLabel sx={{ color: "#ccc" }}>Generation Type</InputLabel>
              <Select
                value={generationType || ""}
                onChange={(e) => setGenerationType(e.target.value || null)}
                sx={{
                  bgcolor: "#121212",
                  borderRadius: "12px",
                  color: "#fff",
                  "& .MuiSelect-icon": { color: "#fff" },
                }}
                MenuProps={{
                  PaperProps: { sx: { bgcolor: "#121212", color: "#fff" } },
                  disableScrollLock: true,
                }}
              >
                <MenuItem value="">All</MenuItem>
                {Object.values(GenerationTypeEnum).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Category */}
            <FormControl
              sx={{ minWidth: { xs: "100%", sm: 160, md: 200 } }}
              size="small"
            >
              <InputLabel sx={{ color: "#ccc" }}>Category</InputLabel>
              <Select
                value={category || ""}
                onChange={(e) => setCategory(e.target.value || null)}
                sx={{
                  bgcolor: "#121212",
                  borderRadius: "12px",
                  color: "#fff",
                  "& .MuiSelect-icon": { color: "#fff" },
                }}
                MenuProps={{
                  PaperProps: { sx: { bgcolor: "#121212", color: "#fff" } },
                  disableScrollLock: true,
                }}
              >
                <MenuItem value="">All</MenuItem>
                {Object.values(PromptCategoryEnum).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              textAlign: "center",
              mb: 4,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" }, 
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
              alignItems: { xs: "stretch", sm: "center" },
            }}
          >
            {/* Clear Filters - always below all filters */}
            {(modelType || generationType || category) && (
              <Box sx={{ width: { xs: "100%", sm: "auto" }, mt: { xs: 1, sm: 0 } }}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth={true} // ✅ full width on mobile
                  onClick={() => {
                    setModelType(null);
                    setGenerationType(null);
                    setCategory(null);
                  }}
                  sx={{
                    color: "#fff",
                    bgcolor: "rgba(40, 40, 40, 0.8)",
                    borderRadius: "12px",
                    borderColor: "#555",
                    whiteSpace: "nowrap",
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            )}
          </Box>

          {/* Results */}
          {loading ? (
            <Grid container spacing={4}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
                </Grid>
              ))}
            </Grid>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <>
              <Grid container spacing={4}>
                {paginatedPrompts.length > 0 ? (
                  paginatedPrompts.map((prompt) => (
                    <ExplorePromptCard key={prompt._id} prompt={prompt} />
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
