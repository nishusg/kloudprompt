// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';

// Import Pages
import HomePage from './pages/HomePage';
import PromptDetailPage from './pages/PromptDetailPage';
import CreatePromptPage from './pages/CreatePromptPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExplorePage from './pages/ExplorePage';
import NotFoundPage from './pages/NotFoundPage';

// ✨ This component handles the conditional routing logic
const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show a loading indicator while checking for an existing session
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        {/* You can replace this with a proper spinner component */}
        <p>Loading...</p>
      </div>
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
          {/* Redirect logged-in users from auth pages to home */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </>
      ) : (
        /* --- Routes for UNAUTHENTICATED users --- */
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Redirect any other path to the login page */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
};


// The main App component just sets up the providers
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