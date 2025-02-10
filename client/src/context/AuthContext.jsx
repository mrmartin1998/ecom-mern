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
  const [user, setUser] = useState(() => {
    // Initialize from localStorage if available
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email, password, remember = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      if (remember) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } else {
        sessionStorage.setItem('token', data.data.token);
        sessionStorage.setItem('user', JSON.stringify(data.data.user));
      }
      
      api.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
      setUser(data.data.user);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Login failed');
      return { success: false, error: error.response?.data?.error?.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
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
      setIsLoading(false);
      navigate(ROUTES.HOME);
    }
  }, [navigate]);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', userData);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.error?.message };
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/auth/verify-email?token=${token}`);
      return { success: true, data: response.data };
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Verification failed');
      return { success: false, error: error.response?.data?.error?.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    isLoading,
    error,
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
