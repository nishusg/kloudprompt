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
  IconButton,
} from "@mui/material";
import { CloseOutlined, AddOutlined } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { updateUser } from "../../services/UserService";
import { useSnackbar } from "../../context/SnackbarContext";

const EditProfilePage: React.FC = () => {
  const { user: loggedInUser, setUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [userName, setUserName] = useState(loggedInUser?.userName || "");
  const [fullName, setFullName] = useState(loggedInUser?.fullName || "");
  const [phone, setPhone] = useState(loggedInUser?.phone || "");
  const [bio, setBio] = useState(loggedInUser?.bio || "");
  const [socialKey, setSocialKey] = useState("");
  const [socialValue, setSocialValue] = useState("");
  const [socialLinks, setSocialLinks] = useState<{ [key: string]: string }>(
    loggedInUser?.socialLinks || {}
  );

  const [loading, setLoading] = useState(false);

  // Update specific key/value
  const handleChangeSocial = (key: string, value: string) => {
    if (!key && !value) return;
    setSocialLinks({...socialLinks, [key]: value });
    setSocialKey("");
    setSocialValue("");
  };

  const handleRemoveSocial = (key: string) => {
    const updated = { ...socialLinks };
    delete updated[key];
    setSocialLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedInUser?._id) return;

    try {
      setLoading(true);
      const updatedUser = await updateUser(loggedInUser._id, {
        userName,
        fullName,
        email: loggedInUser?.email,
        phone,
        bio,
        socialLinks,
      });
      showSnackbar("Profile updated successfully!", "success");
      setUser?.(updatedUser);
      setTimeout(() => navigate("/profile/" + updatedUser._id), 1500);
    } catch (error: any) {
      showSnackbar(error?.message || "Failed to update profile", "error");
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
      <Container maxWidth="md">
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
                sx={{
                  width: 100,
                  height: 100,
                  alignSelf: "center",
                  bgcolor: "#42a5f5",
                  color: "#fff",
                }}
              >
                {loggedInUser?.userName.charAt(0).toUpperCase()}
              </Avatar>

              {/* Other fields */}
              <TextField
                label="Full Name"
                fullWidth
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "white" } }}
              />
              <TextField
                label="Username"
                fullWidth
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "white" } }}
              />
              <TextField
                label="Email"
                fullWidth
                value={loggedInUser?.email || ""}
                disabled
                InputLabelProps={{ style: { color: "#aaa" } }}
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: 'grey', // makes text visible when disabled
                  },
                }}
              />
              <TextField
                label="Phone"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "white" } }}
              />
              <TextField
                label="Bio"
                fullWidth
                multiline
                minRows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                InputLabelProps={{ style: { color: "#aaa" } }}
                InputProps={{ style: { color: "white" } }}
              />

              {/* Social Links Section */}
              <Typography variant="h6" color="#fff">
                Social Links
              </Typography>
              <Stack spacing={2}>
                {/* Existing social links */}
                {Object.entries(socialLinks).map(([key, value]) => (
                  <Stack
                    key={key}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <TextField
                      label="Platform"
                      value={key}
                      disabled
                      InputLabelProps={{ style: { color: "#aaa" } }}
                      sx={{
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: 'grey', // makes text visible when disabled
                        },
                      }}
                    />
                    <TextField
                      label="Link"
                      value={value}
                      disabled
                      fullWidth
                      InputLabelProps={{ style: { color: "#aaa" } }}
                      sx={{
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: 'grey', // makes text visible when disabled
                        },
                      }}
                    />
                    <IconButton
                      onClick={() => handleRemoveSocial(key)}
                      sx={{ color: "red" }}
                    >
                      <CloseOutlined />
                    </IconButton>
                  </Stack>
                ))}

                {/* Inputs to add new social link */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    label="Platform"
                    value={socialKey}
                    onChange={(e) => setSocialKey(e.target.value)}
                    placeholder="e.g. Twitter"
                    InputLabelProps={{ style: { color: "#aaa" } }}
                    InputProps={{ style: { color: "white" } }}
                  />
                  <TextField
                    label="Link"
                    value={socialValue}
                    onChange={(e) => setSocialValue(e.target.value)}
                    placeholder="https://twitter.com/username"
                    fullWidth
                    InputLabelProps={{ style: { color: "#aaa" } }}
                    InputProps={{ style: { color: "white" } }}
                  />
                  <IconButton
                    onClick={() => handleChangeSocial(socialKey, socialValue)}
                    sx={{ color: "#42a5f5" }}
                  >
                    <AddOutlined />
                  </IconButton>
                </Stack>
              </Stack>

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
                variant="outlined"
                sx={{ textTransform: "none", borderRadius: "50px" }}
                onClick={() => navigate("/profile/" + loggedInUser?._id)}
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
