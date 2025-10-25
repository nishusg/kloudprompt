import React from "react";
import { Box, Container, Typography, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        px: 2,
        mt: "auto",
        py: 4,
        position: "relative",
        zIndex: 1,
        background: "rgba(20,20,30,0.65)", // Glass effect
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 0 30px rgba(0,0,0,0.5)",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: { xs: '300px', md: '400px' },
          height: { xs: '300px', md: '400px' },
          background: 'radial-gradient(circle, rgba(0,204,255,0.25), transparent 70%)',
          filter: 'blur(100px)',
          zIndex: 0,
        }}
      />
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>

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
                position: "relative",
                transition: "color 0.3s, transform 0.3s",
                "&:hover": {
                  color: "#42a5f5",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {link.text}
            </Typography>
          ))}
        </Stack>

        {/* Copyright */}
        <Typography
          variant="body2"
          align="center"
          sx={{
            opacity: 0.8,
            color: "#888888",
            fontSize: "0.875rem",
          }}
        >
          © {new Date().getFullYear()}{" "}
          {(window as any)._env_?.REACT_APP_Website_Title || process.env.REACT_APP_Website_Title}. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
