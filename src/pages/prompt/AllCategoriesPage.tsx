import { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  Avatar,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getPromptsByCategory } from "../../services/PromptService";
import { PromptCategoryEnum } from "../../utils/Enum";
import { Prompt } from "../../models/Prompt";
import CategoryIcon from '@mui/icons-material/Category';

const AllCategoriesPage = () => {
  const [categoryPrompts, setCategoryPrompts] = useState<Record<string, Prompt[]>>({});
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const categories = Object.values(PromptCategoryEnum);

  // Fetch prompts for a category
  const fetchCategoryData = useCallback(async (category: string) => {
    try {
      setLoading(true);
      const data = await getPromptsByCategory(category, 6);
      setCategoryPrompts((prev) => ({
        ...prev,
        [category]: data.prompts || [],
      }));
    } catch (err) {
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
    <Box sx={{ bgcolor: "#0a0a0a", minHeight: "100vh", py: 4 }}>
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
              <Typography variant="h5" fontWeight="600" sx={{ color: "#fff" }}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Typography>
              <Button
                variant="text"
                sx={{ color: "#42a5f5" }}
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
                  categoryPrompts[category].map((p) => (
                    <Paper
                      key={p._id}
                      onClick={() => handleCardClick(p._id)}
                      sx={{
                        flex: "0 0 260px",
                        p: 2,
                        borderRadius: 3,
                        bgcolor: "#1e1e1e",
                        color: "#fff",
                        cursor: "pointer",
                        transition: "0.3s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 20px rgba(66,165,245,0.3)",
                        },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        sx={{ mb: 1 }}
                      >
                        {p.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#bbb", mb: 1 }}>
                        {p.description.length > 60
                          ? `${p.description.slice(0, 60)}...`
                          : p.description}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            bgcolor: "#42a5f5",
                            fontSize: "0.8rem",
                          }}
                        >
                          {p.author?.userName?.charAt(0).toUpperCase() || "U"}
                        </Avatar>
                        <Typography variant="caption" sx={{ color: "#aaa" }}>
                          {p.author?.userName || "Anonymous"}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))
                ) : (
                  [...Array(3)].map((_, i) => (
                    <Skeleton
                      key={i}
                      variant="rectangular"
                      width={260}
                      height={120}
                      sx={{
                        flex: "0 0 260px",
                        borderRadius: 3,
                        bgcolor: "#1e1e1e",
                      }}
                    />
                  ))
                )}
              </Box>

              {/* Left/Right Scroll Buttons */}
              <Button
                onClick={() => {
                  const row = document.getElementById(`scroll-row-${category}`);
                  if (row) row.scrollBy({ left: -300, behavior: "smooth" });
                }}
                sx={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  minWidth: "30px",
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(66,165,245,0.7)" },
                }}
              >
                ◀
              </Button>
              <Button
                onClick={() => {
                  const row = document.getElementById(`scroll-row-${category}`);
                  if (row) row.scrollBy({ left: 300, behavior: "smooth" });
                }}
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  minWidth: "30px",
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(66,165,245,0.7)" },
                }}
              >
                ▶
              </Button>
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
