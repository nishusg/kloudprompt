import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const words = ['designers', 'creators', 'developers', 'innovators', 'artists', 'thinkers'];

const HomePage: React.FC = () => {
  const [index, setIndex] = useState(0);        // Which word
  const [subIndex, setSubIndex] = useState(0);  // Which letter
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !deleting) {
      // Pause at full word before deleting
      setTimeout(() => setDeleting(true), 1000);
      return;
    }

    if (subIndex === 0 && deleting) {
      // Move to next word after deleting
      setDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
    }, deleting ? 50 : 150); // typing slower, deleting faster

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index]);

  return (
    <Box
      sx={{
        backgroundColor: '#0a0a0a',
        minHeight: { xs: '85dvh', md: '85vh' },
        display: 'flex',
        justifyContent: 'center',   // ✅ vertical centering
        alignItems: 'center',       // ✅ horizontal centering
        textAlign: 'center',
        color: 'white',
        p: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          maxWidth: '1000px',
          px: { xs: 2, sm: 4 }, // responsive padding
        }}
      >
        {/* Title */}
        <Typography
          component="h1"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
            lineHeight: { xs: 1.2, sm: 1.2, md: 1.1 },
            textAlign: "center", 
            color: "#42a5f5",
            letterSpacing: { xs: 0.5, md: 1 },
          }}
        >
          Prompt Collection
        </Typography>

        {/* Typing tagline */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Box
            component="span" // or "p", "h1", etc., depending on semantics
            sx={{
              opacity: 0.6,
              fontWeight: 500,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
            }}
          >
            A platform for
          </Box>
          
          <Box
            sx={{
              py: 0.5,
              borderRadius: 3,
              minWidth: '80px',
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
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
            maxWidth: '900px',
            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
          }}
        >
          Discover, share, and get inspired by creative prompts from around the world.
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 3, mt: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              component={Link}
              to="/explore"
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                color: 'white',
                fontWeight: 'bold',
                px: 3,
                transition: 'background 0.4s ease',
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
              variant="outlined"
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
                fontWeight: 'bold',
                px: 3,
                transition: 'all 0.4s ease',
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
