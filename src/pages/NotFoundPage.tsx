import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Stack, Divider, Link } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'grey.100',
        p: 3,
      }}
    >
      <Box sx={{ textAlign: 'center', maxWidth: 'md' }}>
        <Typography
          variant="h1"
          component="div"
          fontWeight="bold"
          color="primary"
          sx={{ fontSize: 'clamp(6rem, 20vw, 10rem)' }}
        >
          404
        </Typography>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            size="large"
          >
            Go to Homepage
          </Button>
          <Button
            component={RouterLink}
            to="/prompts"
            variant="outlined"
            size="large"
          >
            Browse Prompts
          </Button>
        </Stack>

        <Divider sx={{ my: 4, mx: 'auto', width: '50%' }} />

        <Typography variant="body2" color="text.secondary">
          Need help?{' '}
          <Link component={RouterLink} to="/contact" underline="hover">
            Contact support
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default NotFoundPage;