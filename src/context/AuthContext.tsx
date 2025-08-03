import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, getCurrentUser } from '../services/UserService';
import { User } from '../models/User';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password:string) => Promise<void>;
  // ✨ Completed the register function's type definition
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await loginUser({ email, password });
      localStorage.setItem('authToken', token);
      setUser(user);
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw err; // Re-throw for the form component to catch
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // ✨ 1. Completed the register function logic
  const register = useCallback(async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await registerUser({ username, email, password });
      localStorage.setItem('authToken', token);
      setUser(user);
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // Check for an existing session on app load
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        // With the interceptor, getCurrentUser will automatically have the token
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        // If the token is invalid, remove it
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✨ 2. Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }), [user, loading, error, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};