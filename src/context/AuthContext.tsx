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
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../services/UserService';
import { User } from '../models/User';

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  setUser?: (user: User | null) => void;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const Access_Token_Key = 'accessToken';
const Refresh_Token_Key = 'refreshToken';

const setToken = (token_key: string, token: string) => localStorage.setItem(token_key, token);
const getToken = (token_key: string) => localStorage.getItem(token_key);
const clearToken = (token_key: string) => localStorage.removeItem(token_key);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      clearToken(Access_Token_Key);
      clearToken(Refresh_Token_Key);
      setUser(null);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const res: AuthResponse = await loginUser({ email, password });

        setToken(Access_Token_Key, res.accessToken);
        setToken(Refresh_Token_Key, res.refreshToken);

        if (res.user) {
          setUser(res.user);
        } else {
          await fetchCurrentUser();
        }

        return true;
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCurrentUser]
  );

  const register = useCallback(
    async (userName: string, email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        // First register
        await registerUser({ userName, email, password });

        // Then auto-login
        const res: AuthResponse = await loginUser({ email, password });

        setToken(Access_Token_Key, res.accessToken);
        setToken(Refresh_Token_Key, res.refreshToken);

        if (res.user) {
          setUser(res.user);
        } else {
          await fetchCurrentUser();
        }

        return true;
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCurrentUser]
  );

  const logout = useCallback(async () => {
    await logoutUser();
    clearToken(Access_Token_Key);
    clearToken(Refresh_Token_Key);
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken(Access_Token_Key); // ✅ FIXED
      if (!token) {
        setLoading(false);
        return;
      }
      await fetchCurrentUser();
      setLoading(false);
    };
    initAuth();
  }, [fetchCurrentUser]);

  const value = useMemo(
    () => ({
      user,
      setUser,
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
