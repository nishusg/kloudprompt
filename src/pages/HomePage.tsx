import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const words = ['designers', 'creators', 'developers'];

const previews = [
  { title: 'Fantasy World Builder', description: 'Create immersive worlds for your next story.' },
  { title: 'AI Art Prompts', description: 'Generate stunning AI-powered artworks with creative prompts.' },
  { title: 'Social Media Caption Ideas', description: 'Catchy captions to boost engagement.' },
];

// Card animation variants
const cardVariants = {
  initial: { scale: 1, boxShadow: '0px 0px 0px rgba(0,0,0,0)' },
  hover: {
    scale: 1.05,
    boxShadow: '0px 8px 24px rgba(0,0,0,0.3)',
    transition: { type: 'spring' as const, stiffness: 300 },
  },
  tap: { scale: 0.98 },
};

const HomePage: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: '#000',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
        gap: 5,
        color: 'white',
        textAlign: 'center',
      }}
    >
      {/* Title */}
      <Typography
        component="h1"
        sx={{
          fontWeight: 'bold',
          fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5.5rem' },
        }}
      >
        Prompt Gallery
      </Typography>

      {/* Animated tagline */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Typography
          sx={{
            opacity: 0.6,
            fontWeight: 500,
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
          }}
        >
          A platform for
        </Typography>

        <Box
          sx={{
            border: '1px solid white',
            borderRadius: 3,
            px: 2,
            py: 0.5,
            fontWeight: 'bold',
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
            userSelect: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: '150px',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={words[index]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {words[index]}
            </motion.div>
          </AnimatePresence>
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

      {/* Animated preview cards */}
      <Grid container spacing={2} sx={{ maxWidth: 900, mt: 2 }}>
        {previews.map((item, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <motion.div
              variants={cardVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Card
                sx={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  height: '100%',
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
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
  );
};

export default HomePage;
