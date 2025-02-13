import { useEffect, useState } from 'react'
import { adminService } from '@/services/admin.service'
import AdminCard from '../common/AdminCard'
import LoadingSpinner from '@/components/common/ui/LoadingSpinner'

const SystemMetricsDisplay = () => {
  const [metrics, setMetrics] = useState({
    users: {
      total: 0,
      active: 0,
      disabled: 0,
      new24h: 0
    },
    system: {
      events: 0,
      recentEvents: 0
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await adminService.getSystemMetrics()
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

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-error">{error}</div>

  return (
    <AdminCard title="System Metrics">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User Metrics Section */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">User Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Users:</span>
              <span className="font-bold">{metrics.users.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Users:</span>
              <span className="font-bold text-success">{metrics.users.active}</span>
            </div>
            <div className="flex justify-between">
              <span>Disabled Users:</span>
              <span className="font-bold text-error">{metrics.users.disabled}</span>
            </div>
            <div className="flex justify-between">
              <span>New Users (24h):</span>
              <span className="font-bold text-info">{metrics.users.new24h}</span>
            </div>
          </div>
        </div>

        {/* System Events Section */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">System Activity</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Events:</span>
              <span className="font-bold">{metrics.system.events}</span>
            </div>
            <div className="flex justify-between">
              <span>Recent Events (24h):</span>
              <span className="font-bold text-primary">{metrics.system.recentEvents}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminCard>
  )
}

export default SystemMetricsDisplay
