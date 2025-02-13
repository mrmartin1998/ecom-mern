import { useState, useEffect } from 'react'
import { adminService } from '@/services/admin.service'
import AdminCard from '../common/AdminCard'
import LoadingSpinner from '@/components/common/ui/LoadingSpinner'

const AdminDashboardStats = () => {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await adminService.getSystemMetrics()
        setMetrics(data)
      } catch (err) {
        setError('Failed to load system metrics')
        console.error('Error fetching metrics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-error">{error}</div>

  const statCards = [
    { title: 'Total Users', value: metrics?.totalUsers || 0, icon: '👥' },
    { title: 'Active Users', value: metrics?.activeUsers || 0, icon: '✅' },
    { title: 'New Users (24h)', value: metrics?.newUsers || 0, icon: '🆕' },
    { title: 'System Events', value: metrics?.totalEvents || 0, icon: '📊' }
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
