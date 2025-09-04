import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Link,
  Paper,
} from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";

const NotFoundPage: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000, #333)",
        color: "#fff",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 5 },
          textAlign: "center",
          maxWidth: 500,
          width: "100%",
          backgroundColor: "rgba(255,255,255,0.05)",
          borderRadius: 3,
          backdropFilter: "blur(6px)",
        }}
      >
        {/* Icon */}
        <SearchOffIcon
          sx={{
            fontSize: { xs: 60, sm: 80 },
            color: "primary.main",
            mb: 2,
          }}
        />

        {/* 404 Title */}
        <Typography
          variant="h1"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "6rem", sm: "8rem" },
            color: "primary.main",
            lineHeight: 1,
          }}
        >
          404
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h5"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{ mt: 1, fontSize: { xs: "1.4rem", sm: "1.8rem" } }}
        >
          Page Not Found
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          color="grey.300"
          sx={{ mb: 4, fontSize: { xs: "0.9rem", sm: "1rem" } }}
        >
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </Typography>

        {/* Buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          sx={{ mb: 3 }}
        >
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            size="large"
            sx={{ fontWeight: "bold", width: { xs: "100%", sm: "auto" } }}
          >
            Go to Homepage
          </Button>
          <Button
            component={RouterLink}
            to="/explore"
            variant="outlined"
            size="large"
            sx={{
              color: "#fff",
              borderColor: "#fff",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Browse Prompts
          </Button>
        </Stack>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.2)" }} />

        {/* Contact link */}
        <Typography variant="body2" color="grey.400" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
          Need help?{" "}
          <Link
            component={RouterLink}
            to="/contact"
            underline="hover"
            sx={{ color: "primary.main", fontWeight: "bold" }}
          >
            Contact support
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default NotFoundPage;