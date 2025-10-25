// src/components/layout/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { ErrorBoundary } from './ErrorBoundary';

const HEADER_HEIGHT = 64; // px, match Header height
const FOOTER_HEIGHT = 100; // px, match Footer height

const MainLayout: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#0a0a0a',
        position: 'relative',
      }}
    >
      {/* Fixed Header */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1200, height: HEADER_HEIGHT }}>
        <Header />
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: `${HEADER_HEIGHT}px`, // padding to avoid header
          pb: `${FOOTER_HEIGHT}px`, // padding to avoid footer
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Box>

      {/* Fixed Footer */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          height: FOOTER_HEIGHT,
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
};

export default MainLayout;
