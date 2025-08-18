import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Avatar,
  Paper,
  Stack,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { updateUser } from "../services/UserService";

const EditProfilePage: React.FC = () => {
  const { user: loggedInUser, setUser } = useAuth(); // optional setUser to update context
  const navigate = useNavigate();

  const [userName, setUserName] = useState(loggedInUser?.userName || "");
  const [email, setEmail] = useState(loggedInUser?.email || "");
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedInUser?._id) return;

    try {
      setLoading(true);
      const updatedUser = await updateUser(loggedInUser._id, {
        userName,
        email,
      });

      // Update context
      setUser?.(updatedUser);

      navigate("/profile/" + updatedUser._id);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        background: "#0a0a0a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: "24px",
            background: "#121212",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3} color="#fff">
            Edit Profile
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Avatar
                src={"/default-avatar.png"}
                sx={{
                  width: 80,
                  height: 80,
                  border: "2px solid #42a5f5",
                  alignSelf: "center",
                }}
              />
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "white" } }}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "white" } }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: "#42a5f5",
                  color: "#000",
                  fontWeight: 600,
                  borderRadius: "50px",
                  px: 3,
                  "&:hover": { bgcolor: "#42a5f5" },
                }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="text"
                sx={{ color: "#aaa", textTransform: "none" }}
                onClick={() => navigate("/profile/"+ loggedInUser?._id)}
              >
                Cancel
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditProfilePage;
