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
  Chip,
} from "@mui/material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { useNavigate } from "react-router-dom";
import { Prompt } from "../../models/Prompt";
import { getTrendingPrompts } from "../../services/PromptService";
import { DefaultUserName } from "../../utils/Constants";
import { RankingFilterEnum } from "../../utils/Enum";
import TrendingPromptSkeleton from "../../components/skeleton/TrendingPromptSkeleton";

const TrendingPromptsPage = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<RankingFilterEnum>(RankingFilterEnum.All);
  const PAGE_LIMIT = 10;

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const data = await getTrendingPrompts(PAGE_LIMIT, filter);
        setPrompts(data || []);
      } catch (err: any) {
        console.error("Failed to fetch trending prompts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, [filter]);

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
            component="h1"
            sx={{
              fontSize: { xs: "1.6rem", sm: "2rem", md: "2.5rem" },
              background: "#fff",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: { xs: 0.5, md: 1 },
            }}
          >
            Trending prompt
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap" }}>
          {Object.values(RankingFilterEnum).map((f) => (
            <Chip
              key={f}
              label={
                f === RankingFilterEnum.All
                  ? "All-Time"
                  : f.charAt(0).toUpperCase() + f.slice(1)
              }
              clickable
              onClick={() => setFilter(f)}
              sx={{
                bgcolor: filter === f ? "#42a5f5" : "#1a1a1a",
                color: filter === f ? "#000" : "#fff",
                fontWeight: 600,
                border: "1px solid #42a5f5",
                "&:hover": {
                  bgcolor: "#42a5f5",
                  color: "#000",
                },
              }}
            />
          ))}
        </Stack>

        <List disablePadding>
        {loading ? (
          <>
            {Array.from(new Array(PAGE_LIMIT)).map((_, i) => (
              <TrendingPromptSkeleton key={i} />
            ))}
          </>
        ) : prompts.length === 0 ? (
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              bgcolor: "#1a1a1a",
              color: "#bbb",
              border: "1px dashed rgba(144,202,249,0.3)",
              opacity: 0.6
            }}
          >
            <Typography
              variant="h6"
              fontWeight="600"
              sx={{
                color: "#fff",
                mb: 1,
              }}
            >
              No trending prompts yet
            </Typography>
            <Typography variant="body2" sx={{ color: "#aaa" }}>
              Be the first one to create and explore prompts!
            </Typography>
          </Paper>
        ) : (
          prompts.map((prompt, index) => (
            <Paper
              key={index}
              elevation={4}
              sx={{
                mb: 3,
                p: 2.5,
                borderRadius: 3,
                cursor: "pointer",
                bgcolor: "#121212",
                color: "#e0e0e0",
                transition: "0.3s",
                border: "1px solid transparent",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(144,202,249,0.3)",
                  borderColor: "#42a5f5",
                },
              }}
              onClick={() => handlePromptClick(prompt._id)}
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
                        component="span"
                        sx={{ mb: 1 }}
                      >
                        {prompt.title}
                      </Typography>
                    </Stack>
                  }
                  primaryTypographyProps={{ component: "span" }}
                  secondary={
                    <Stack spacing={1.2}>
                      {/* Description */}
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{ display: "block", color: "#b0b0b0" }}
                      >
                        {prompt.description && prompt.description.length > 80
                          ? `${prompt.description.slice(0, 80)}...`
                          : prompt.description}
                      </Typography>

                      {/* Author + Views row */}
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
                            if(prompt.author?._id){
                              e.stopPropagation();
                              navigate(`/users/${prompt.author?._id}`);
                            }
                          }}
                        >
                          By {" "}
                          <Box component="span" sx={{ color: prompt.author?._id ? "#42a5f5" : "#aaa" }}>
                            {prompt.author?.userName || DefaultUserName}
                          </Box>
                        </Typography>

                        <Typography
                          variant="caption"
                          component="span"
                          sx={{ color: "#888", ml: "auto" }}
                        >
                          👁 {prompt.normalizeCount ?? 0} views
                        </Typography>
                      </Stack>
                    </Stack>
                  }
                  secondaryTypographyProps={{ component: "span" }}
                />
              </ListItem>
            </Paper>
          ))
        )}
      </List>
      </Container>
    </Box>
  );
};

export default TrendingPromptsPage;
