import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const words = ['designers', 'creators', 'developers', 'innovators', 'artists', 'thinkers'];

const HomePage: React.FC = () => {
  const [index, setIndex] = useState(0);        
  const [subIndex, setSubIndex] = useState(0);  
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), 1000);
      return;
    }

    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
    }, deleting ? 50 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index]);

  return (
    <Box
      sx={{
        backgroundColor: '#0a0a0a',
        minHeight: { xs: '80vh', md: '85vh' },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: 'white',
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 4, sm: 6 },
          maxWidth: '1000px',
          width: '100%',
        }}
      >
        {/* Typing tagline */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            flexWrap: 'wrap',
            justifyContent: 'center',
            px: { xs: 1, sm: 0 },
          }}
        >
          <Box
            component="span"
            sx={{
              opacity: 0.6,
              fontWeight: 500,
              fontSize: { xs: '1.2rem', sm: '1.8rem', md: '2.2rem' },
            }}
          >
            A platform for
          </Box>
          
          <Box
            sx={{
              py: 0.5,
              borderRadius: 3,
              minWidth: 'fit-content',
              fontWeight: 'bold',
              fontSize: { xs: '1.2rem', sm: '1.8rem', md: '2.2rem' },
              userSelect: 'none',
            }}
          >
            <motion.span
              key={words[index]}
              style={{
                background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'monospace',
              }}
            >
              {words[index].substring(0, subIndex)}
              <span style={{ borderRight: '2px solid #42a5f5', marginLeft: 2 }} />
            </motion.span>
          </Box>
        </Box>

        {/* Subtext */}
        <Typography
          sx={{
            opacity: 0.7,
            fontWeight: 400,
            maxWidth: '800px',
            fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.3rem' },
            lineHeight: 1.6,
            px: { xs: 1.5, sm: 0 },
          }}
        >
          Discover, share, and get inspired by creative prompts from around the world.
        </Typography>

        {/* Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 2, sm: 3 },
            mt: { xs: 3, sm: 4 },
            flexWrap: 'wrap',
            justifyContent: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            width: '100%',
            maxWidth: { xs: '250px', sm: '100%' },
          }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              component={Link}
              to="/explore"
              fullWidth
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                color: 'white',
                fontWeight: 'bold',
                px: 3,
                py: 1.2,
                '&:hover': { background: 'linear-gradient(90deg, #42a5f5, #1976d2)' },
              }}
            >
              Explore
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              component={Link}
              to="/create"
              fullWidth
              variant="outlined"
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
                fontWeight: 'bold',
                px: 3,
                py: 1.2,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  borderColor: '#42a5f5',
                  color: '#42a5f5',
                },
              }}
            >
              Create
            </Button>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
