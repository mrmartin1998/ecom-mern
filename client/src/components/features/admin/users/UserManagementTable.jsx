import { useState, useEffect } from 'react'
import { adminService } from '@/services/admin.service'
import AdminCard from '../common/AdminCard'
import AdminHeader from '../common/AdminHeader'
import LoadingSpinner from '@/components/common/ui/LoadingSpinner'
import { toast } from 'react-toastify'

const UserManagementTable = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUsers = async () => {
    try {
      const usersData = await adminService.getUsers()
      console.log('Fetched users:', usersData)
      setUsers(Array.isArray(usersData) ? usersData : [])
    } catch (err) {
      console.error('Error in fetchUsers:', err)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      console.log('Updating role:', { userId, newRole });
      await adminService.updateUserRole(userId, newRole)
      toast.success('User role updated successfully')
      console.log('Role update successful');
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error('Role update failed:', error);
      toast.error('Failed to update user role')
    }
  }

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      await adminService.updateUserStatus(userId, newStatus)
      toast.success('User status updated successfully')
      fetchUsers() // Refresh the list
    } catch (error) {
      toast.error('Failed to update user status')
      console.error('Error updating status:', error)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-error">{error}</div>

  return (
    <AdminCard>
      <AdminHeader title="User Management">
        <div className="text-sm text-gray-500">
          Total Users: {users.length}
        </div>
      </AdminHeader>

      {/* Add Debug Panel */}
      <div className="mb-4 p-4 bg-base-200 rounded-lg">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify({
            usersLoaded: users.length > 0,
            firstUser: users[0] ? {
              id: users[0]._id,
              role: users[0].role,
              status: users[0].status
            } : null,
            error: error,
            loading: loading
          }, null, 2)}
        </pre>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.email}</td>
                <td>
                  <select 
                    value={user.role}
                    onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                    className="select select-bordered w-full max-w-xs"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <select 
                    value={user.status}
                    onChange={(e) => handleStatusUpdate(user._id, e.target.value)}
                    className="select select-bordered w-full max-w-xs"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                <td>
                  <button className="btn btn-sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminCard>
  )
}

export default UserManagementTable
