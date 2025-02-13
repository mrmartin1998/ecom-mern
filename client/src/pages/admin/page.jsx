import { useEffect } from 'react'
import AdminLayout from '@/components/features/admin/layout/AdminLayout'
import AdminDashboardStats from '@/components/features/admin/dashboard/AdminDashboardStats'
import UserManagementTable from '@/components/features/admin/users/UserManagementTable'

const AdminDashboard = () => {
  // Verify admin access
  useEffect(() => {
    // Add admin role verification
  }, [])

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Basic Stats Section */}
        <div className="mb-8">
          <AdminDashboardStats />
        </div>

        {/* User Management Section */}
        <div className="mb-8">
          <UserManagementTable />
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
