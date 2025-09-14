import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  List,
  Box,
  Stack,
  Chip,
} from "@mui/material";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { DefaultUserName } from "../utils/Constants";
import { getLeaderboard } from "../services/PromptService";
import { LeaderboardResponse } from "../models";
import { RankingFilterEnum } from "../utils/Enum";

const LeaderboardPage = () => {
    const [leaders, setLeaders] = useState<LeaderboardResponse[]>([]);
    const navigate = useNavigate();
    const [filter, setFilter] = useState<RankingFilterEnum>(RankingFilterEnum.All);

    useEffect(() => {
      const fetchLeaderboard = async () => {
        try {
          const data = await getLeaderboard(10, filter);
          setLeaders(data || []);
        } catch (err: any) {
          console.error("Failed to fetch leaderboard:", err);
        }
      };
      fetchLeaderboard();
    }, [filter]);


    const handleLeaderboardClick = (id: string) => {
        if (id) navigate(`/users/${id}`);
    };

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
          <LeaderboardIcon
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
            Trending user
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
          {leaders.length === 0 ? (
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, sm: 4 },
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
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1.5, sm: 2 },
                    borderRadius: 3,
                    bgcolor: "#121212",
                    cursor: "pointer",
                    color: "#e0e0e0",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap", 
                    gap: { xs: 1, sm: 0 },
                    transition: "0.3s",
                    border: "1px solid transparent",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(66,165,245,0.25)",
                      borderColor: "#42a5f5",
                    },
                }}
                onClick={() => handleLeaderboardClick(user.userId)}
            >
                {/* Left Section → Rank + Username */}
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ flexGrow: 1, minWidth: 0 }}
                >
                    <Chip
                    label={`#${index + 1}`}
                    size="small"
                    sx={{
                        minWidth: { xs: 36, sm: 50 },
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
                        fontSize: { xs: "0.7rem", sm: "0.9rem" },
                    }}
                    />

                    <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        noWrap
                        color="#fff"
                        sx={{
                            maxWidth: { xs: 100, sm: 200 }, 
                            fontSize: { xs: "0.85rem", sm: "1rem" },
                            cursor: "pointer",
                            textDecoration: "none",
                            "&:hover": { color: "#90caf9" },
                        }}
                        >
                        {user.userName || DefaultUserName}
                    </Typography>
                </Stack>

                {/* Right Section → Stats */}
                <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{
                        color: "#aaa",
                        fontSize: { xs: "0.75rem", sm: "0.85rem" },
                        flexShrink: 0, 
                    }}
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
