import api from './api';

class AuthService {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(token) {
    try {
      const response = await api.get(`/auth/verify-email?token=${token}`);
      console.log('Auth service response:', response.data);
      return response.data; // Just return the raw response data
    } catch (error) {
      console.error('Auth service error:', error);
      return { success: false };
    }
  }

  async logout() {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      // Still remove token even if API call fails
      localStorage.removeItem('token');
      throw error;
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

// Export an instance instead of the class
export const authService = new AuthService();

// Also export the class as default if needed
export default AuthService; 