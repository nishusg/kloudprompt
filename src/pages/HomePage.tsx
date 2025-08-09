import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const words = ['designers', 'creators', 'developers'];

const HomePage: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % words.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: '#000',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column', // stack vertically
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        gap: 4, // space between items
        color: 'white',
        textAlign: 'center',
      }}
    >
      <Typography
        component="h1"
        sx={{
          fontWeight: 'bold',
          fontSize: {
            xs: '2.5rem',
            sm: '3.5rem',
            md: '4.5rem',
            lg: '5.5rem',
          },
        }}
      >
        Prompt collection
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            opacity: 0.6,
            fontWeight: 500,
            fontSize: {
              xs: '1.8rem',
              sm: '2.5rem',
              md: '3rem',
              lg: '3.5rem',
            },
          }}
        >
          A platform for
        </Typography>

        <Box
          sx={{
            border: '2px solid white',
            borderRadius: 1,
            px: 2,
            py: 0.5,
            fontWeight: 'bold',
            fontSize: {
              xs: '1.8rem',
              sm: '2.5rem',
              md: '3rem',
              lg: '3.5rem',
            },
            userSelect: 'none',
          }}
        >
          {words[index]}
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
