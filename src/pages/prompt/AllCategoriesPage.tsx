import { useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  Skeleton,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PromptCategoryEnum } from "../../utils/Enum";
import { DefaultUserName } from "../../utils/Constants";
import CategoryIcon from "@mui/icons-material/Category";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Redux
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchCategoryPrompts } from "../../store/allCategorySlice";


const AllCategoriesPage = () => {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { categoryPrompts, visibleCategories, currentIndex, loading } =
    useAppSelector((state) => state.allCategories);

  const categories = Object.values(PromptCategoryEnum);

  // IntersectionObserver for infinite category loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          if (currentIndex < categories.length) {
            const nextCategory = categories[currentIndex];
            // Only dispatch if not already loaded
            if (!categoryPrompts[nextCategory]) {
              dispatch(fetchCategoryPrompts(nextCategory as string));
            }
          }
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
  }, [categories, currentIndex, dispatch, categoryPrompts]);


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

        <Typography
          variant="body2"
          sx={{ color: "#888", textAlign: "center", mt: 2 }}
        >
          Loaded {currentIndex} of {categories.length} categories
        </Typography>

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
                  categoryPrompts[category].map((p) => (
                    <Paper
                      key={p._id}
                      onClick={() => handleCardClick(p._id)}
                      sx={{
                        flex: "0 0 260px",
                        p: 2,
                        borderRadius: 4,
                        bgcolor: "#1e1e1e",
                        color: "#fff",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        border: "1px solid rgba(144,202,249,0.15)",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                        "&:hover": {
                          boxShadow: "0 8px 24px rgba(144,202,249,0.3)",
                          borderColor: "#42a5f5",
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
                      <Typography
                        variant="body2"
                        sx={{ color: "#bbb", mb: 1 }}
                      >
                        {p.description.length > 60
                          ? `${p.description.slice(0, 60)}...`
                          : p.description}
                      </Typography>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={{ mt: 0.5 }}
                      >
                        <Typography
                          variant="caption"
                          component="span"
                          sx={{ color: "#aaa" }}
                          onClick={(e) => {
                            if (p.author?._id) {
                              e.stopPropagation();
                              navigate(`/users/${p.author?._id}`);
                            }
                          }}
                        >
                          By{" "}
                          <Box
                            component="span"
                            sx={{
                              color: p.author?._id ? "#42a5f5" : "#aaa",
                            }}
                          >
                            {p.author?.userName || DefaultUserName}
                          </Box>
                        </Typography>

                        <Typography
                          variant="caption"
                          component="span"
                          sx={{ color: "#888", ml: "auto" }}
                        >
                          👁 {p.views ?? 0} views
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
