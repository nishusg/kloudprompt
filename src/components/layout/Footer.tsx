import React from 'react';
import { Box, Container, Typography, Divider, Link, Stack } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      // ✨ Add padding and a background color for better visual separation
      sx={{
        py: 3, // Vertical padding
        px: 2, // Horizontal padding
        mt: 'auto', // Pushes footer to the bottom of the viewport in a flex container
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        {/* ✨ Add some useful links */}
        <Stack
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Link href="/about" color="inherit" underline="hover">
            About Us
          </Link>
          <Link href="/contact" color="inherit" underline="hover">
            Contact
          </Link>
          <Link href="/privacy" color="inherit" underline="hover">
            Privacy Policy
          </Link>
        </Stack>

        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} PromptShare. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;