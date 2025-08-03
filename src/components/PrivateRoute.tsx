// src/components/PrivateRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming you have a useAuth hook

const PrivateRoute: React.FC = () => {
  const { user, loading } = useAuth(); // Get user and loading state from your context

  // Show a loading indicator while checking auth status
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is authenticated, render the child route. Otherwise, redirect to login.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;