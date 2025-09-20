import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  List,
  Avatar,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { DefaultUserName } from "../utils/Constants";
import { searchUsers } from "../services/UserService";
import { User } from "../models";
import { useSnackbar } from "../context/SnackbarContext";
import UserSearchSkeleton from "../components/skeleton/UserSearchSkeleton";

const UserSearchPage = () => {
  const { showSnackbar } = useSnackbar();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const PAGE_LIMIT = 5;

  const fetchUsers = async (searchQuery: string, pageNumber: number) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { users, totalUsers: tp } = await searchUsers(
        searchQuery.trim(),
        pageNumber,
        PAGE_LIMIT
      );
      if (pageNumber === 1) {
        setResults(users);
      } else {
        setResults((prev) => [...prev, ...users]);
      }
      setTotalUsers(tp);
    } catch (err: any) {
      showSnackbar(err?.message || "Failed to search users:", "error");
    } finally {
      setLoading(false);
    }
  };

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchUsers(query, 1);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleUserClick = (id: string) => {
    navigate(`/users/${id}`);
  };

  const handleLoadMore = () => {
    if (page < totalUsers) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUsers(query, nextPage);
    }
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
          <PersonSearchIcon
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
            Search Users
          </Typography>
        </Box>

        {/* Search Input */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            sx: {
              bgcolor: "#1a1a1a",
              borderRadius: 3,
              input: { color: "#fff" },
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setPage(1);
                    fetchUsers(query, 1);
                  }}
                  sx={{ color: "#42a5f5" }}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Results list */}
        {query && (
          <>
            <Paper
              elevation={3}
              sx={{
                mt: 2,
                borderRadius: 3,
                bgcolor: "#0a0a0a",
                color: "#e0e0e0",
              }}
            >
              <List disablePadding>
                {loading && page === 1 ? (
                  <>
                    {Array.from(new Array(PAGE_LIMIT)).map((_, i) => (
                      <UserSearchSkeleton key={i} />
                    ))}
                  </>
                ) : results.length === 0 ? (
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
                      sx={{
                        color: "#fff",
                        mb: 1,
                      }}
                    >
                      No users found 👤
                    </Typography>
                  </Paper>
                ) : (
                  results.map((user) => (
                    <Paper
                      key={user._id}
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
                      onClick={() => handleUserClick(user._id)}
                  >
                      {/* Left Section → Rank + Username */}
                      <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ flexGrow: 1, minWidth: 0 }}
                      >
                          <Avatar
                            src={user.userName || ""}
                            sx={{ bgcolor: "#42a5f5" }}
                          >
                            {user.userName?.charAt(0).toUpperCase() ||
                              DefaultUserName.charAt(0)}
                          </Avatar>

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
                              }}
                              >
                              {user.userName || DefaultUserName}
                          </Typography>
                      </Stack>
                  </Paper>
                  ))
                )}
              </List>
            </Paper>

            {/* Load More button */}
            {(results.length > 0 && results.length < totalUsers) && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More"}
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default UserSearchPage;
