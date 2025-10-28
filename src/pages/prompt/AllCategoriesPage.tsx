import { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  IconButton,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getPromptsByCategory } from "../../services/PromptService";
import { PromptCategoryEnum } from "../../utils/Enum";
import { Prompt } from "../../models/Prompt";
import CategoryIcon from '@mui/icons-material/Category';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AllCategorySkeleton from "../../components/skeleton/AllCategorySkeleton";

const AllCategoriesPage = () => {
  const [categoryPrompts, setCategoryPrompts] = useState<Record<string, Prompt[]>>({});
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const PAGE_LIMIT = 6;

  const categories = Object.values(PromptCategoryEnum);

  // Fetch prompts for a category
  const fetchCategoryData = useCallback(async (category: string) => {
    try {
      setLoading(true);
      const data = await getPromptsByCategory(category, PAGE_LIMIT);
      setCategoryPrompts((prev) => ({
        ...prev,
        [category]: data.prompts || [],
      }));
    } catch (err: any) {
      console.error("Failed to fetch prompts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // IntersectionObserver for infinite loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          setCurrentIndex((prevIndex) => {
            if (prevIndex < categories.length) {
              const nextCategory = categories[prevIndex];
              setVisibleCategories((prev) =>
                prev.includes(nextCategory) ? prev : [...prev, nextCategory]
              );
              fetchCategoryData(nextCategory);
              return prevIndex + 1;
            }
            return prevIndex;
          });
        }
      },
      { threshold: 0.3 }
    );

    const sentinel = observerRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
      observer.disconnect();
    };
  }, [categories, fetchCategoryData]);

  const handleCardClick = (id: string) => {
    navigate(`/prompts/${id}`);
  };

  return (
    <Box sx={{ minHeight: "80vh", bgcolor: "#0a0a0a", py: 4 }}>
      <Container maxWidth="lg">
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
          <CategoryIcon
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
            Explore by categories
          </Typography>
        </Box>

        {/* Category Sections */}
        {visibleCategories.map((category) => (
          <Box key={category} sx={{ mb: 6, position: "relative" }}>
            {/* Section Header */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <Typography
                variant="h5"
                fontWeight="600"
                sx={{
                  color: "#fff",
                  textTransform: "capitalize",
                  letterSpacing: 0.5,
                }}
              >
                {category}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  color: "#42a5f5",
                  borderColor: "#42a5f5",
                  borderRadius: 3,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "rgba(66,165,245,0.1)",
                    borderColor: "#64b5f6",
                  },
                }}
                onClick={() => navigate(`/categories/${category}`)}
              >
                See All →
              </Button>
            </Stack>

            {/* Scrollable Row with Buttons */}
            <Box sx={{ position: "relative" }}>
              <Box
                id={`scroll-row-${category}`}
                sx={{
                  display: "flex",
                  gap: 2,
                  overflowX: "auto",
                  pb: 1,
                  scrollBehavior: "smooth",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                {categoryPrompts[category] ? (
                  categoryPrompts[category].length > 0 ? (
                    categoryPrompts[category].map((p) => (
                      <Card
                        key={p._id}
                        onClick={() => handleCardClick(p._id)}
                        sx={{
                          flex: "0 0 260px",
                          display: "flex",
                          flexDirection: "column",
                          bgcolor: "#121212",
                          color: "#fff",
                          borderRadius: 4,
                          overflow: "hidden",
                          cursor: "pointer",
                          border: "1px solid rgba(144,202,249,0.15)",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 8px 24px rgba(144,202,249,0.3)",
                            borderColor: "#42a5f5",
                          },
                        }}
                      >
                        {/* Top Image */}
                        <CardMedia
                          component="img"
                          height="180"
                          image={p.promptUrl || '/default-image.png'}
                          alt={p.title}
                          sx={{
                            objectFit: "cover",
                            transition: "transform 0.4s ease",
                          }}
                        />

                        {/* Bottom Content */}
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            gutterBottom
                            noWrap
                          >
                            {p.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="grey.400"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              mb: 1,
                            }}
                          >
                            {p.description}
                          </Typography>

                          <Typography
                            variant="caption"
                            component="span"
                            sx={{ color: "#888", ml: "auto" }}
                          >
                            {p.views ?? 0} views
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    [...Array(3)].map((_, i) => (
                      <Paper
                        key={i}
                        sx={{
                            flex: "0 0 260px",
                            p: 2,
                            borderRadius: 4,
                            bgcolor: "#1e1e1e",
                            color: "#fff",
                            cursor: "disabled",
                            transition: 'all 0.3s ease',
                            border: "1px dashed rgba(144,202,249,0.3)",
                            opacity: 0.6
                          }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 600, color: "#fff" }}>
                          Nothing here yet.
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#aaa" }}>
                          Add the first {category} prompt!
                        </Typography>
                      </Paper>
                    ))
                  )
                ) : (
                  [...Array(PAGE_LIMIT)].map((_, i) => (
                    <AllCategorySkeleton key={i} />
                  ))
                )}
              </Box>

              {/* Left/Right Scroll Buttons */}
              <IconButton
                onClick={() => {
                  const row = document.getElementById(`scroll-row-${category}`);
                  if (row) row.scrollBy({ left: -300, behavior: "smooth" });
                }}
                sx={{
                  position: "absolute",
                  left: -16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  bgcolor: "rgba(0,0,0,0.7)",
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(66,165,245,0.9)" },
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  const row = document.getElementById(`scroll-row-${category}`);
                  if (row) row.scrollBy({ left: 300, behavior: "smooth" });
                }}
                sx={{
                  position: "absolute",
                  right: -16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  bgcolor: "rgba(0,0,0,0.7)",
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(66,165,245,0.9)" },
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Box>
        ))}

        {/* Infinite Scroll Sentinel */}
        <div ref={observerRef} style={{ height: "40px" }} />

        {/* Loading Indicator */}
        {loading && (
          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "#bbb", mt: 2 }}
          >
            Loading more prompts...
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default AllCategoriesPage;
