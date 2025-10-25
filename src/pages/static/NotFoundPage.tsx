import React from "react";
import { Container, Paper, Typography, Box, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "80vh", bgcolor: "#0a0a0a", py: 6 }}>
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            bgcolor: "#121212",
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#42a5f5",
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem", lg: "3rem" },
            }}
          >
            404 - Page Not Found
          </Typography>

          <Divider sx={{ bgcolor: "#2a2a2a", mb: 3 }} />

          <Typography variant="body1" sx={{ mb: 3, opacity: 0.8 }}>
            Oops! The page you're looking for doesn’t exist or has been moved.
          </Typography>

          <Button
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: "#42a5f5",
              borderRadius: 2,
              px: 4,
              py: 1,
              textTransform: "none",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/")}
          >
            Go Back Home
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFoundPage;