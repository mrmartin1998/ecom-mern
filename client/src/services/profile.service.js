import api from './api';

const profileService = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },

  updateEmail: async (email) => {
    const response = await api.put('/profile/email', { email });
    return response.data;
  },

  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/profile/password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  deleteAccount: async () => {
    await api.delete('/profile');
  }
};

export default profileService; 