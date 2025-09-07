import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getPromptsByCategory } from "../services/PromptService";
import { PromptCategoryEnum } from "../utils/Enum";
import { Prompt } from "../models/Prompt";
import ExploreIcon from '@mui/icons-material/Explore';

const ExplorePage = () => {
  const [categoryPrompts, setCategoryPrompts] = useState<
    Record<string, Prompt[]>
  >({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results: Record<string, Prompt[]> = {};
        for (const category of Object.values(PromptCategoryEnum)) {
          const data = await getPromptsByCategory(category, 6); // fetch top 6 for each category
          results[category] = data.prompts || [];
        }
        setCategoryPrompts(results);
      } catch (err) {
        console.error("Failed to fetch prompts by category:", err);
      }
    };
    fetchData();
  }, []);

  const handleCardClick = (id: string) => {
    navigate(`/prompts/${id}`);
  };

  return (
    <Box sx={{ bgcolor: "#0a0a0a", minHeight: "100vh", py: 4 }}>
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

        {Object.entries(categoryPrompts).map(([category, prompts]) =>
          prompts.length > 0 ? (
            <Box key={category} sx={{ mb: 6 }}>
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
                  sx={{ color: "#fff" }}
                >
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

              {/* Horizontal Scrollable Row */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  overflowX: "auto",
                  pb: 1,
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                {prompts.map((p) => (
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
                    <Typography
                      variant="body2"
                      sx={{ color: "#bbb", mb: 1 }}
                    >
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
                ))}
              </Box>
            </Box>
          ) : null
        )}
      </Container>
    </Box>
  );
};

export default ExplorePage;
