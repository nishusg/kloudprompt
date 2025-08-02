import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
    >
      <Container maxWidth="lg">
        {/* Divider and Copyright */}
        <Divider sx={{ my: 4 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} PromptShare. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;