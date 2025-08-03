// src/App.tsx

import React from 'react';
// 1. We no longer need useEffect or useNavigate in this component
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

// This component handles the conditional routing logic
const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show a loading spinner while the initial auth check is running
  if (loading) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. The declarative <Routes> component is now solely responsible for navigation.
  // When `isAuthenticated` changes, this component re-renders, and the correct
  // set of routes is applied automatically.
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
          
          {/* If a logged-in user tries to visit /login, redirect them to home */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </>
      ) : (
        /* --- Routes for UNAUTHENTICATED users --- */
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* If a logged-out user tries to visit any other page, redirect them to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
};


// The main App component structure is correct and remains unchanged
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
