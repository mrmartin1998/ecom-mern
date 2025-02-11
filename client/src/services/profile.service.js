import api from './api';

const profileService = {
  getProfile: async () => {
    const response = await api.get('/api/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/api/profile', profileData);
    return response.data;
  },

  updateEmail: async (email) => {
    const response = await api.put('/api/profile/email', { email });
    return response.data;
  },

  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/api/profile/password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  deleteAccount: async () => {
    await api.delete('/api/profile');
  }
};

export default profileService; 