import React from "react";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: "80vh", bgcolor: "#0a0a0a", py: 6 }}>
    <Container maxWidth="md">
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          bgcolor: "#121212", // Dark card
          color: "white",
        }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#42a5f5",
          }}
        >
          Privacy Policy
        </Typography>

        <Typography variant="body1" paragraph>
          Your privacy is important to us. This Privacy Policy explains how{" "}
          <strong>Prompt Sharing Platform</strong> collects, uses, and protects
          your information when you use our service.
        </Typography>

        <Typography
          variant="h5"
          gutterBottom
          sx={{
            mt: 4,
            fontWeight: 600,
            color: "lightblue",
          }}
        >
          Information We Collect
        </Typography>

        <List>
          <ListItem>
            <ListItemText primary="📌 Account information (username, email) when you sign up" />
          </ListItem>
          <ListItem>
            <ListItemText primary="📌 Content you share (prompts, comments, bookmarks)" />
          </ListItem>
          <ListItem>
            <ListItemText primary="📌 Usage data (how you interact with the platform)" />
          </ListItem>
        </List>

        <Typography
          variant="h5"
          gutterBottom
          sx={{
            mt: 4,
            fontWeight: 600,
            color: "lightblue",
          }}
        >
          How We Use Your Information
        </Typography>

        <Typography variant="body1" paragraph>
          We use your information to:
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="✅ Provide and improve our services" />
          </ListItem>
          <ListItem>
            <ListItemText primary="✅ Personalize your experience" />
          </ListItem>
          <ListItem>
            <ListItemText primary="✅ Ensure platform security and prevent abuse" />
          </ListItem>
        </List>

        <Typography
          variant="h5"
          gutterBottom
          sx={{
            mt: 4,
            fontWeight: 600,
            color: "lightblue",
          }}
        >
          Data Protection
        </Typography>
        <Typography variant="body1" paragraph>
          We take appropriate security measures to protect your data from
          unauthorized access, alteration, or disclosure. However, no method of
          transmission over the internet is 100% secure.
        </Typography>

        <Typography
          variant="h5"
          gutterBottom
          sx={{
            mt: 4,
            fontWeight: 600,
            color: "lightblue",
          }}
        >
          Your Choices
        </Typography>
        <Typography variant="body1" paragraph>
          You can update or delete your account at any time. If you have
          concerns about your privacy, feel free to contact us.
        </Typography>

        <Box mt={4}>
          <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Paper>
    </Container>
    </Box>
  );
};

export default PrivacyPolicyPage;
