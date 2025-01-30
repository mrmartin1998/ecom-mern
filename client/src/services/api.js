const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

export const userService = {
  // Get all users
  getAllUsers: async () => {
    const response = await fetch(`${API_URL}/users`);
    return response.json();
  },

  // Create user
  createUser: async (userData) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  // Sign in
  signIn: async (credentials) => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    return response.json();
  }
}; 