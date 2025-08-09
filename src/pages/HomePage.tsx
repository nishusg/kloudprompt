import React from 'react';
import { Box, Typography } from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#000',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2, // Adds some padding for very small screens
      }}
    >
      <Typography
        component="h1"
        sx={{
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center', // Ensures text centers if it wraps
          // Responsive font sizes
          fontSize: {
            xs: '2.5rem', // For extra-small screens (mobile)
            sm: '3.5rem', // For small screens (tablet)
            md: '4.5rem', // For medium screens (desktop)
            lg: '5.5rem', // For large screens
          },
        }}
      >
        Prompt collection
      </Typography>
    </Box>
  );
};

export default HomePage;