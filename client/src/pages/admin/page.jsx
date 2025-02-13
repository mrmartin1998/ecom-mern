import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import AdminLayout from '@/components/features/admin/layout/AdminLayout'
import AdminDashboardStats from '@/components/features/admin/dashboard/AdminDashboardStats'
import SystemMetricsDisplay from '@/components/features/admin/dashboard/SystemMetricsDisplay'
import UserManagementTable from '@/components/features/admin/users/UserManagementTable'
import AuditLogViewer from '@/components/features/admin/audit/AuditLogViewer'

const AdminDashboard = () => {
  const { user, hasRole } = useAuth()
  const navigate = useNavigate()

  // Verify admin access
  useEffect(() => {
    if (!hasRole(['admin'])) {
      navigate('/')
    }
  }, [hasRole, navigate])

  if (!user || user.role !== 'admin') {
    return null // Or loading spinner
  }

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Basic Stats Section */}
        <div className="mb-8">
          <AdminDashboardStats />
        </div>

        {/* Detailed Metrics Section */}
        <div className="mb-8">
          <SystemMetricsDisplay />
        </div>

        {/* User Management Section */}
        <div className="mb-8">
          <UserManagementTable />
        </div>

        {/* Audit Logs Section */}
        <div className="mb-8">
          <AuditLogViewer />
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
