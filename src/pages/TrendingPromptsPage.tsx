import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Stack,
  Avatar,
  Chip,
} from "@mui/material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { useNavigate } from "react-router-dom";
import { Prompt } from "../models/Prompt";
import { getTrendingPrompts } from "../services/PromptService";

const TrendingPromptsPage = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrendingPrompts(5);
        setPrompts(data || []); // ✅ defensive check
      } catch (err) {
        console.error("Failed to fetch trending prompts:", err);
      }
    };
    fetchTrending();
  }, []);

  // handle click
  const handlePromptClick = (id: string) => {
    if (id) navigate(`/prompts/${id}`);
  };

  return (
    <Box sx={{ minHeight: "80vh", bgcolor: "#0a0a0a", py: 4 }}>
      <Container maxWidth="md">
        {/* Page Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            gap: { xs: 1.5, sm: 2 },
            flexWrap: "wrap",
          }}
        >
          <WhatshotIcon
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
            sx={{
              fontSize: { xs: "1.6rem", sm: "2rem", md: "2.5rem" },
              background: "#fff",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: { xs: 0.5, md: 1 },
            }}
          >
            Top 5 trending prompts
          </Typography>
        </Box>

        <List disablePadding>
          {prompts.map((p, index) => (
            <Paper
              key={p._id}
              elevation={4}
              sx={{
                mb: 3,
                p: 2.5,
                borderRadius: 3,
                cursor: "pointer",
                bgcolor: "#1e1e1e",
                color: "#e0e0e0",
                transition: "0.3s",
                border: "1px solid transparent",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(144,202,249,0.3)",
                  borderColor: "#90caf9",
                },
              }}
              onClick={() => handlePromptClick(p._id)}
            >
              <ListItem alignItems="flex-start" disableGutters>
                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip
                        label={`#${index + 1}`}
                        size="small"
                        sx={{
                          bgcolor: "#42a5f5",
                          color: "#000",
                          fontWeight: 600,
                          borderRadius: "8px",
                        }}
                      />
                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        color="#fff"
                        sx={{ mb: 1 }}
                      >
                        {p.title}
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Stack spacing={1.2}>
                      {/* Description */}
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{
                          display: "block",
                          color: "#b0b0b0",
                        }}
                      >
                        {p.description && p.description.length > 80
                          ? `${p.description.slice(0, 80)}...`
                          : p.description}
                      </Typography>

                      {/* Author + Views row */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={{ mt: 0.5 }}
                      >
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            bgcolor: "#42a5f5",
                            fontSize: "0.8rem",
                          }}
                        >
                          {p.author?.userName?.charAt(0).toUpperCase() || "A"}
                        </Avatar>

                        <Typography
                          variant="caption"
                          component="span"
                          sx={{ color: "#aaa" }}
                        >
                          By{" "}
                          <Box component="span" sx={{ color: "#fff" }}>
                            {p.author?.userName || "Unknown"}
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
                    </Stack>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      </Container>
    </Box>
  );
};

export default TrendingPromptsPage;
