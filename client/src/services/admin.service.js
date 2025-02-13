import api from './api'

export const adminService = {
  getSystemMetrics: async () => {
    try {
      console.log('Fetching system metrics...')
      const response = await api.get('/admin/metrics')
      console.log('Metrics response:', response.data)
      return response.data
    } catch (error) {
      console.error('Metrics error:', error)
      throw error
    }
  },

  getUsers: async () => {
    try {
      console.log('Fetching users...')
      const response = await api.get('/admin/users')
      console.log('Users response:', response.data)
      return response.data.data || []
    } catch (error) {
      console.error('Users error:', error)
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
  },

  getAuditLogs: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString()
      const response = await api.get(`/admin/logs?${queryString}`)
      return response.data
    } catch (error) {
      console.error('Audit logs error:', error)
      throw error
    }
  }
} 