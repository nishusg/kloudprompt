// src/pages/CategoryPage.tsx
import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { Prompt } from "../../models";
import { getPromptsByCategory } from "../../services/PromptService";

const PromptCategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!category) return;

    const fetchPrompts = async () => {
      try {
        setLoading(true);
        const data = await getPromptsByCategory(category, 12, page);
        setPrompts(data.prompts);
        // setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Failed to load prompts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [category, page]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setSearchParams({ page: String(value) });
  };

  return (
    <Box sx={{ minHeight: "80vh", bgcolor: "#0a0a0a", py: 4 }}>
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            gap: { xs: 1.5, sm: 2 },
            flexWrap: "wrap",
          }}
        >
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
            Category: {category}
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : prompts.length === 0 ? (
          <Typography variant="h6" sx={{ color: "#bbb", textAlign: "center", mt: 6 }}>
            No prompts found in this category.
          </Typography>
        ) : (
          <>
            <Grid container spacing={3}>
              {prompts.map((prompt) => (
                <Grid item xs={12} sm={6} md={4} key={prompt._id}>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: "#1e1e1e",
                      borderRadius: 3,
                      border: "1px solid #333",
                      transition: "0.3s",
                      "&:hover": { border: "1px solid #42a5f5" },
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      component={RouterLink}
                      to={`/prompts/${prompt._id}`}
                      sx={{
                        color: "#fff",
                        textDecoration: "none",
                        "&:hover": { color: "#90caf9" },
                      }}
                    >
                      {prompt.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#bbb", mt: 1 }}
                      noWrap
                    >
                      {prompt.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#888", mt: 2, display: "block" }}
                    >
                      👁 {prompt.views} views
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#fff",
                  },
                  "& .Mui-selected": {
                    bgcolor: "#42a5f5 !important",
                    color: "#000",
                  },
                }}
              />
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default PromptCategoryPage;
