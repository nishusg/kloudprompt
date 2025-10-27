// src/components/layout/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from './Header';
import { ErrorBoundary } from './ErrorBoundary';

const HEADER_HEIGHT = 64; // px, match Header height
const FOOTER_HEIGHT = 100; // px, match Footer height

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
        <Header isMobile={isMobile} />
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
    </Box>
  );
};

export default MainLayout;
