// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import { CircularProgress, Box } from '@mui/material';

// Import Pages
import HomePage from './pages/HomePage';
import PromptDetailPage from './pages/prompt/PromptDetailPage';
import CreatePromptPage from './pages/prompt/CreatePromptPage';
import ProfilePage from './pages/profile/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ExplorePage from './pages/ExplorePage';
import NotFoundPage from './pages/static/NotFoundPage';
import AboutPage from './pages/static/AboutPage';
import ContactPage from './pages/static/ContactPage';
import PrivacyPolicyPage from './pages/static/PrivacyPolicyPage';
import TrendingPromptsPage from './pages/prompt/TrendingPromptsPage';
import EditProfilePage from './pages/profile/EditProfilePage';
import PlaygroundPage from './pages/PlaygroundPage';
import UserProfilePage from './pages/profile/UserProfilePage';
import ChangePasswordPage from './pages/profile/ChangePasswordPage';
import { SnackbarProvider } from './context/SnackbarContext';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import EmailVerification from './components/profile/EmailVerification';
import LeaderboardPage from './pages/LeaderboardPage';
import NotificationsPage from './pages/NotificationsPage';

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
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/trending" element={<TrendingPromptsPage />} />
            <Route path="/update" element={<EditProfilePage />} />
            <Route path="/playground/:promptId" element={<PlaygroundPage />} />
            <Route path="/users/:userId" element={<UserProfilePage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
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
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />

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
      <SnackbarProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </SnackbarProvider>
    </Router>
  );
};

export default App;
