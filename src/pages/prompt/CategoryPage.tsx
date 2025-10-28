import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemText,
  Pagination,
} from "@mui/material";
import { Prompt } from "../../models/Prompt";
import { getPromptsByCategory } from "../../services/PromptService";
import { DefaultUserName } from "../../utils/Constants";
import CategorySkeleton from "../../components/skeleton/CategorySkeleton";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const PAGE_LIMIT = 9;

  useEffect(() => {
    if (!category) return;

    const fetchPrompts = async () => {
      setLoading(true);
      try {
        const data = await getPromptsByCategory(category, PAGE_LIMIT, page);
        setPrompts(data.prompts);
        setTotalPages(Number(data.totalPages));
      } catch (err: any) {
        console.error("Failed to load prompts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [category, page]);

  const handlePromptClick = (id: string) => {
    navigate(`/prompts/${id}`);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setSearchParams({ page: String(value) });
  };

  return (
    <Box sx={{ minHeight: "80vh", bgcolor: "#0a0a0a", py: 4 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          fontWeight="bold"
          component="h1"
          sx={{
            mb: 3,
            fontSize: { xs: "1.6rem", sm: "2rem", md: "2.5rem" },
            background: "#fff",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: { xs: 0.5, md: 1 },
          }}
        >
          Category: {category}
        </Typography>

        <List disablePadding>
          {loading
            ? Array.from(new Array(PAGE_LIMIT)).map((_, i) => <CategorySkeleton key={i} />)
            : prompts.length === 0 ? (
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                    bgcolor: "#1a1a1a",
                    color: "#bbb",
                    border: "1px dashed rgba(144,202,249,0.3)",
                    opacity: 0.6,
                  }}
                >
                  <Typography variant="h6" fontWeight={600} sx={{ color: "#fff", mb: 1 }}>
                    No prompts found in this category.
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#aaa" }}>
                    Be the first to create a prompt!
                  </Typography>
                </Paper>
              ) : (
                prompts.map((prompt) => (
                  <Paper
                    key={prompt._id}
                    elevation={4}
                    sx={{
                      mb: 3,
                      p: 2.5,
                      borderRadius: 3,
                      cursor: "pointer",
                      bgcolor: "#121212",
                      color: "#e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      transition: "0.3s",
                      border: "1px solid transparent",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(144,202,249,0.3)",
                        borderColor: "#42a5f5",
                      },
                    }}
                    onClick={() => handlePromptClick(prompt._id)}
                  >
                    <Box
                      component="img"
                      src={prompt.promptUrl || "/default-image.png"}
                      alt={prompt.title}
                      sx={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 2,
                        mr: 2.5,
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />

                    <ListItem alignItems="flex-start" disableGutters sx={{ flex: 1 }}>
                      <ListItemText
                        primary={
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              color="#fff"
                              component="span"
                            >
                              {prompt.title}
                            </Typography>
                          </Stack>
                        }
                        secondary={
                          <Stack spacing={1.2}>
                            <Typography
                              variant="body2"
                              sx={{ display: "block", color: "#b0b0b0" }}
                            >
                              {prompt.description && prompt.description.length > 80
                                ? `${prompt.description.slice(0, 80)}...`
                                : prompt.description}
                            </Typography>

                            <Stack direction="row" alignItems="center" spacing={1.5}>
                              <Typography
                                variant="caption"
                                component="span"
                                sx={{ color: "#aaa" }}
                                onClick={(e) => {
                                  if (prompt.author?._id) {
                                    e.stopPropagation();
                                    navigate(`/users/${prompt.author._id}`);
                                  }
                                }}
                              >
                                By{" "}
                                <Box
                                  component="span"
                                  sx={{ color: prompt.author?._id ? "#42a5f5" : "#aaa" }}
                                >
                                  {prompt.author?.userName || DefaultUserName}
                                </Box>
                              </Typography>

                              <Typography
                                variant="caption"
                                component="span"
                                sx={{ color: "#888", ml: "auto" }}
                              >
                                {prompt.views ?? 0} views
                              </Typography>
                            </Stack>
                          </Stack>
                        }
                      />
                    </ListItem>
                  </Paper>
                ))
              )}
        </List>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              siblingCount={0}
              boundaryCount={1}
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
        )}
      </Container>
    </Box>
  );
};

export default CategoryPage;
