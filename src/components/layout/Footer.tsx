import React from 'react';
import { Box, Container, Typography, Divider, Link, Stack } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        px: 2,
        mt: 'auto',
        backgroundColor: '#000', // Black background
        color: '#fff', // White text
      }}
    >
      <Container maxWidth="lg">
        {/* Divider for separation */}
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 3 }} />

        {/* Navigation Links */}
        <Stack
          direction="row"
          justifyContent="center"
          spacing={3}
          sx={{ mb: 2 }}
        >
          {['About', 'Contact', 'Privacy Policy'].map((text, i) => (
            <Link
              key={i}
              href={`/${text.toLowerCase().replace(/\s+/g, '')}`}
              color="inherit"
              underline="none"
              sx={{
                fontWeight: 500,
                transition: 'color 0.3s',
                '&:hover': { color: '#1877F2' }, // Orange hover
              }}
            >
              {text}
            </Link>
          ))}
        </Stack>

        {/* Copyright */}
        <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}>
          © {new Date().getFullYear()} PromptShare. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
