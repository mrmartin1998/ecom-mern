import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

// Create context
export const AuthContext = createContext(null);

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

  useEffect(() => {
    // Check for existing token and validate it
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await api.get('/auth/validate-token');
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', credentials);
      
      // Store token
      localStorage.setItem('token', response.data.token);
      
      // Set auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      setError(error.message || 'Login failed');
      setIsAuthenticated(false);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
      navigate(ROUTES.HOME);
      setLoading(false);
    }
  }, [navigate]);

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
    verifyEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
