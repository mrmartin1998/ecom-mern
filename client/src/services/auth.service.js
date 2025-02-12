import api from './api';

export const authService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  async verifyEmail(token) {
    try {
      console.log('Making verification request with token:', token);
      const response = await api.get(`/auth/verify-email?token=${token}`);
      console.log('Verification response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, password) {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  async getCurrentUser() {
    return api.get('/auth/me');
  }
}; 