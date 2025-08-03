// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode, useMemo } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../services/UserService';
import { User } from '../models/User';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
        const { user: loggedInUser, token } = await loginUser({ email, password });
        localStorage.setItem('authToken', token);
        setUser(loggedInUser);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed.';
        setError(errorMessage);
        throw err;
    } finally {
        setLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    // ... (implementation is unchanged)
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ✅ FIX: Temporarily remove useMemo to ensure the value object is always fresh.
  // This is a key debugging step to isolate the problem.
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
