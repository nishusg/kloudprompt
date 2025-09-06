import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  List,
  Box,
  Stack,
  Chip,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { DefaultUserName } from "../utils/Constants";
import { getLeaderboard } from "../services/PromptService";
import { LeaderboardResponse } from "../models";

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState<LeaderboardResponse[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard(10);
        setLeaders(data || []);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      }
    };
    fetchLeaderboard();
  }, []);

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
          <EmojiEventsIcon
            sx={{
              fontSize: { xs: 28, sm: 44, md: 50 },
              color: "#42a5f5",
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.1)" },
            }}
          />
          <Typography
            variant="h3"
            fontWeight="bold"
            component="h1"
            sx={{
              fontSize: { xs: "1.6rem", sm: "2rem", md: "2.5rem" },
              background: "#42a5f5",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: { xs: 0.5, md: 1 },
            }}
          >
            Leaderboard – Top 10 Users
          </Typography>
        </Box>

        <List disablePadding>
            {leaders.length === 0 ? (
                <Paper
                elevation={3}
                sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                    bgcolor: "#1a1a1a",
                    color: "#bbb",
                }}
                >
                <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{ color: "#fff", mb: 1 }}
                >
                    No leaderboard data yet 🏆
                </Typography>
                <Typography variant="body2" sx={{ color: "#aaa" }}>
                    Start creating prompts to climb the ranks!
                </Typography>
                </Paper>
            ) : (
                leaders.map((user, index) => (
                <Paper
                    key={user.userId}
                    elevation={4}
                    sx={{
                    mb: 2.5,
                    px: 3,
                    py: 2,
                    borderRadius: 3,
                    bgcolor: "#1e1e1e",
                    color: "#e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "0.3s",
                    border: "1px solid transparent",
                    "&:hover": {
                        boxShadow: "0 6px 20px rgba(66,165,245,0.25)",
                        borderColor: "#42a5f5",
                        transform: "translateY(-2px)",
                    },
                    }}
                >
                    {/* Left Section → Rank + Avatar + Username */}
                    <Stack direction="row" alignItems="center" spacing={2} flex={1}>
                    <Chip
                        label={`#${index + 1}`}
                        size="small"
                        sx={{
                        minWidth: 50,
                        textAlign: "center",
                        bgcolor:
                            index === 0
                            ? "#ffd700"
                            : index === 1
                            ? "#c0c0c0"
                            : index === 2
                            ? "#cd7f32"
                            : "#42a5f5",
                        color: "#000",
                        fontWeight: 600,
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        }}
                    />

                    <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        color="#fff"
                        sx={{
                        cursor: "pointer",
                        textDecoration: "none",
                        "&:hover": { color: "#90caf9" },
                        }}
                        component={RouterLink}
                        to={`/users/${user.userId}`}
                    >
                        {user.userName || DefaultUserName}
                    </Typography>
                    </Stack>

                    {/* Right Section → Stats */}
                    <Stack
                    direction="row"
                    spacing={3}
                    sx={{ color: "#aaa", fontSize: "0.85rem" }}
                    >
                    <Typography variant="body2">{user.promptCount} prompts</Typography>
                    <Typography variant="body2">👁 {user.totalViews} views</Typography>
                    </Stack>
                </Paper>
                ))
            )}
        </List>

      </Container>
    </Box>
  );
};

export default LeaderboardPage;
