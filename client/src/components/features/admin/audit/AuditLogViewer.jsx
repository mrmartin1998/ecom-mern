import { useEffect, useState } from 'react'
import { adminService } from '@/services/admin.service'
import AdminCard from '../common/AdminCard'
import LoadingSpinner from '@/components/common/ui/LoadingSpinner'

const AuditLogViewer = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  })
  const [filters, setFilters] = useState({
    action: '',
    dateFrom: '',
    dateTo: ''
  })

  useEffect(() => {
    fetchLogs()
  }, [pagination.page, filters])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const response = await adminService.getAuditLogs({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      })
      setLogs(response.data.logs)
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total
      }))
    } catch (err) {
      console.error('Error fetching logs:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page on filter change
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  // Helper function to format metadata
  const formatMetadata = (metadata) => {
    if (!metadata) return '-'
    return `IP: ${metadata.ip || 'N/A'} | Agent: ${metadata.userAgent || 'N/A'}`
  }

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-error">{error}</div>

  return (
    <AdminCard title="Audit Logs">
      {/* Filters Section */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          name="action"
          value={filters.action}
          onChange={handleFilterChange}
          className="select select-bordered w-full"
        >
          <option value="">All Actions</option>
          <option value="login">Login</option>
          <option value="update">Update</option>
          <option value="create">Create</option>
          <option value="delete">Delete</option>
        </select>

        <input
          type="date"
          name="dateFrom"
          value={filters.dateFrom}
          onChange={handleFilterChange}
          className="input input-bordered w-full"
          placeholder="From Date"
        />

        <input
          type="date"
          name="dateTo"
          value={filters.dateTo}
          onChange={handleFilterChange}
          className="input input-bordered w-full"
          placeholder="To Date"
        />
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.user?.email || 'System'}</td>
                <td>
                  <span className={`badge ${getBadgeColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td>{formatMetadata(log.metadata)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
          {pagination.total} entries
        </div>
        <div className="btn-group">
          <button
            className="btn btn-sm"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          <button className="btn btn-sm">{pagination.page}</button>
          <button
            className="btn btn-sm"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page * pagination.limit >= pagination.total}
          >
            Next
          </button>
        </div>
      </div>
    </AdminCard>
  )
}

// Helper function for badge colors
const getBadgeColor = (action) => {
  const colors = {
    login: 'badge-info',
    update: 'badge-warning',
    create: 'badge-success',
    delete: 'badge-error'
  }
  return colors[action] || 'badge-ghost'
}

export default AuditLogViewer
