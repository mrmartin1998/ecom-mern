import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { authService } from '../services/auth.service';

// Create context
const AuthContext = createContext(null);

// Export the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          if (response.data?.data?.user) {
            setUser(response.data.data.user);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', userData);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.error?.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAuth = useCallback(() => {
    return !!user;
  }, [user]);

  const hasRole = useCallback((requiredRoles) => {
    if (!user) return false;
    if (!requiredRoles.length) return true;
    return requiredRoles.includes(user.role);
  }, [user]);

  const verifyEmail = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/auth/verify-email?token=${token}`);
      return { success: true, data: response.data };
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Verification failed');
      return { success: false, error: error.response?.data?.error?.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentUser = async () => {
    try {
      const response = await api.get('/api/auth/me');
      const userData = response.data.data.user;
      console.log('Setting user data:', userData);
      setUser(userData);
    } catch (error) {
      console.error('Auth Error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Debug user state changes
  useEffect(() => {
    console.log('Current User State:', user);
  }, [user]);

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    register,
    checkAuth,
    hasRole,
    verifyEmail,
    getCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
