import React from "react";
import { Box, Container, Typography, Divider, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        px: 2,
        mt: "auto",
        backgroundColor: "#000", // Black background
        color: "#fff", // White text
      }}
    >
      <Container maxWidth="lg">
        {/* Divider for separation */}
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", mb: 3 }} />

        {/* Navigation Links */}
        <Stack
          direction="row"
          justifyContent="center"
          spacing={3}
          sx={{ mb: 2 }}
        >
          {[
            { text: "About", path: "/about" },
            { text: "Contact", path: "/contact" },
            { text: "Privacy Policy", path: "/privacy" },
          ].map((link, i) => (
            <Typography
              key={i}
              component={RouterLink}
              to={link.path}
              sx={{
                fontWeight: 500,
                textDecoration: "none",
                color: "inherit",
                transition: "color 0.3s",
                "&:hover": { color: "#42a5f5" }, // Hover effect
              }}
            >
              {link.text}
            </Typography>
          ))}
        </Stack>

        {/* Copyright */}
        <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}>
          © {new Date().getFullYear()} {(window as any)._env_?.REACT_APP_Website_Title || process.env.REACT_APP_Website_Title}. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
