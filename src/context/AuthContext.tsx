// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  ReactNode,
  useMemo
} from 'react';
import { loginUser, registerUser, getCurrentUser } from '../services/UserService';
import { User } from '../models/User';

interface AuthResponse {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'authToken';

const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
const getToken = () => localStorage.getItem(TOKEN_KEY);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeError = (err: unknown): string =>
    err instanceof Error ? err.message : 'Something went wrong. Please try again.';

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user: loggedInUser, token }: AuthResponse = await loginUser({ email, password });
      setToken(token);
      setUser(loggedInUser);
      return true;
    } catch (err) {
      setError(normalizeError(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user: registeredUser, token }: AuthResponse = await registerUser({
        username,
        email,
        password
      });
      setToken(token);
      setUser(registeredUser);
      return true;
    } catch (err) {
      setError(normalizeError(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      clearError
    }),
    [user, loading, error, login, register, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
