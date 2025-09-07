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
import ExploreIcon from "@mui/icons-material/Explore";
import ClearIcon from '@mui/icons-material/Clear';
import { getPrompts } from '../services/PromptService';
import { Prompt } from '../models/Prompt';
import ExplorePromptCard from '../components/prompts/ExplorePromptCard';
import { GenerationTypeEnum, ProviderTypeEnum, PromptCategoryEnum } from '../utils/Enum';

const ExplorePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modelType, setModelType] = useState<string | null>(null);
  const [generationType, setGenerationType] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [totalPrompts, setTotalPrompts] = useState(0);

  const [page, setPage] = useState(1);
  const rowsPerPage = 9;

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch prompts from server when filters/page/search change
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setLoading(true);

        const { prompts, total } = await getPrompts({
          page,
          limit: rowsPerPage,
          search: debouncedSearch || undefined,
          modelType: modelType || undefined,
          generationType: generationType || undefined,
          category: category || undefined
        });


        setPrompts(prompts);
        setTotalPrompts(total);
      } catch (err) {
        setError('Failed to load prompts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, [page, debouncedSearch, modelType, generationType, category]);

  return (
    <Box sx={{ minHeight: "80vh", bgcolor: "#0a0a0a", py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            gap: { xs: 1.5, sm: 2 },
            flexWrap: "wrap",
          }}
        >
          <ExploreIcon
            sx={{
              fontSize: { xs: 28, sm: 44, md: 50 },
              color: "#fff",
              transition: "transform 0.3s ease",
              "&:hover": { transform: "rotate(-5deg) scale(1.05)" },
            }}
          />
          <Typography
            variant="h3"
            fontWeight="bold"
            component="h1"
            sx={{
              fontSize: { xs: "1.6rem", sm: "2rem", md: "2.5rem" },
              background: "#fff",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: { xs: 0.5, md: 1 },
            }}
          >
            Explore Prompts
          </Typography>
        </Box>

        {/* Search */}
        <Paper
          elevation={3}
          sx={{
            maxWidth: 200,
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // reset to first page on search
            }}
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
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          {/* Model Type */}
          <FormControl sx={{ minWidth: { xs: "100%", sm: 160, md: 200 } }} size="small">
            <InputLabel sx={{ color: "#ccc" }}>Model Type</InputLabel>
            <Select
              value={modelType || ""}
              onChange={(e) => {
                setModelType(e.target.value || null);
                setPage(1);
              }}
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
          <FormControl sx={{ minWidth: { xs: "100%", sm: 160, md: 200 } }} size="small">
            <InputLabel sx={{ color: "#ccc" }}>Generation Type</InputLabel>
            <Select
              value={generationType || ""}
              onChange={(e) => {
                setGenerationType(e.target.value || null);
                setPage(1);
              }}
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
          <FormControl sx={{ minWidth: { xs: "100%", sm: 160, md: 200 } }} size="small">
            <InputLabel sx={{ color: "#ccc" }}>Category</InputLabel>
            <Select
              value={category || ""}
              onChange={(e) => {
                setCategory(e.target.value || null);
                setPage(1);
              }}
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

        {/* Clear Filters */}
        {(modelType || generationType || category) && (
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setModelType(null);
                setGenerationType(null);
                setCategory(null);
                setPage(1);
              }}
              sx={{
                color: "#fff",
                bgcolor: "rgba(40, 40, 40, 0.8)",
                borderRadius: "12px",
                borderColor: "#555",
              }}
            >
              Clear Filters
            </Button>
          </Box>
        )}

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
              {prompts.length > 0 ? (
                prompts.map((prompt) => (
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
            {totalPrompts > rowsPerPage && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={Math.ceil(totalPrompts / rowsPerPage)}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  sx={{
                    '& .MuiPaginationItem-root': { color: '#fff' },
                    '& .MuiPaginationItem-root.Mui-selected': {
                      bgcolor: '#42a5f5',
                      color: '#000',
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default ExplorePage;
