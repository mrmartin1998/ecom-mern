import api from './api'

export const adminService = {
  getSystemMetrics: async () => {
    try {
      const response = await api.get('/admin/metrics')
      return response.data
    } catch (error) {
      throw error
    }
  },

  getUsers: async () => {
    try {
      const response = await api.get('/admin/users')
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role })
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateUserStatus: async (userId, status) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, { status })
      return response.data
    } catch (error) {
      throw error
    }
  }
} 