import { useEffect, useState } from 'react'
import { adminService } from '@/services/admin.service'
import AdminCard from '../common/AdminCard'
import LoadingSpinner from '@/components/common/ui/LoadingSpinner'

const AdminDashboardStats = () => {
  const [metrics, setMetrics] = useState({
    users: {
      total: 0,
      active: 0,
      disabled: 0
    },
    roles: {
      admin: 0,
      user: 0
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await adminService.getSystemMetrics()
        console.log('Raw metrics response:', response) // Let's see what we get
        if (response && response.data) {
          setMetrics(response.data)
        }
      } catch (err) {
        console.error('Error fetching metrics:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  // Add debug info
  console.log('Current metrics state:', metrics)

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-error">{error}</div>

  const statCards = [
    { title: 'Total Users', value: metrics.users?.total || 0, icon: '👥' },
    { title: 'Active Users', value: metrics.users?.active || 0, icon: '✅' },
    { title: 'New Users (24h)', value: 0, icon: '🆕' },
    { title: 'System Events', value: 0, icon: '📊' }
  ]

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <AdminCard key={index} className="bg-base-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-70">{stat.title}</div>
                <div className="text-2xl font-bold mt-1">{stat.value}</div>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboardStats
