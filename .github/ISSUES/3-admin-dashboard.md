# Admin Dashboard

## Requirements
### User Story
"As an admin, I want to manage users and monitor system activity so that I can maintain the platform effectively"

### Acceptance Criteria
- [ ] Admin can view all users
- [ ] Admin can manage user roles
- [ ] Admin can disable/enable user accounts
- [ ] Admin can view system metrics
- [ ] Admin can view audit logs
- [ ] Access restricted to admin role only

## Technical Design

### Backend Changes
#### Models
- Update User Model:  ```javascript
  {
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    status: {
      type: String,
      enum: ['active', 'disabled'],
      default: 'active'
    }
  }  ```

- New AuditLog Model:  ```javascript
  {
    action: String,
    userId: ObjectId,
    targetId: ObjectId,
    details: Object,
    timestamp: Date
  }  ```

#### Controllers
- AdminController:
  - getUsersList
  - updateUserRole
  - updateUserStatus
  - getSystemMetrics
  - getAuditLogs

#### Routes
- GET /api/admin/users
- PUT /api/admin/users/:id/role
- PUT /api/admin/users/:id/status
- GET /api/admin/metrics
- GET /api/admin/logs

### Frontend Changes
#### Components
- AdminLayout
- UserManagementTable
- SystemMetricsDisplay
- AuditLogViewer
- RoleManager
- AdminDashboardStats

#### Services
- adminService:
  - User management operations
  - System metrics fetching
  - Audit log retrieval

### Dependencies
- Authentication System ✅ (#1)
- User Profile Management (#2)
- Admin role implementation 