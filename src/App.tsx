// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import { CircularProgress, Box } from '@mui/material';

// Import Pages
import HomePage from './pages/HomePage';
import PromptDetailPage from './pages/PromptDetailPage';
import CreatePromptPage from './pages/CreatePromptPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExplorePage from './pages/ExplorePage';
import NotFoundPage from './pages/NotFoundPage';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // Loading spinner during initial auth check
  if (loading) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {isAuthenticated ? (
        /* --- Routes for AUTHENTICATED users --- */
        <>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/prompts/:id" element={<PromptDetailPage />} />
            <Route path="/create" element={<CreatePromptPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Route>

          {/* Redirect auth users away from login/register */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </>
      ) : (
        /* --- Routes for UNAUTHENTICATED users --- */
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Redirect unauthenticated users to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
