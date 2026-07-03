import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { login as loginApi, register as registerApi, logout as logoutApi, refreshToken } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Try to restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('primeride-user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('primeride-user');
      }
    }

    if (!token && !savedUser) {
      setIsLoading(false);
      return;
    }

    // Attempt silent token refresh
    refreshToken()
      .then((res) => {
        const { accessToken, user: freshUser } = res.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('primeride-user', JSON.stringify(freshUser));
        setUser(freshUser);
      })
      .catch(() => {
        // Refresh failed — clear stale state
        localStorage.removeItem('accessToken');
        localStorage.removeItem('primeride-user');
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await loginApi({ email, password });
    const { accessToken, user: loggedInUser } = res.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('primeride-user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (userData) => {
    const res = await registerApi(userData);
    const { accessToken, user: newUser } = res.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('primeride-user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore errors during logout
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('primeride-user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('primeride-user', JSON.stringify(updatedUser));
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated, isAdmin, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
