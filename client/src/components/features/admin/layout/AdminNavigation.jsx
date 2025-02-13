import { Link, useLocation } from 'react-router-dom'

const AdminNavigation = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/logs', label: 'Audit Logs', icon: '📝' },
  ]

  return (
    <div className="w-64 min-h-screen bg-base-300 p-4">
      <div className="text-xl font-bold mb-8 p-4">Admin Panel</div>
      <nav>
        <ul className="menu menu-vertical">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-3 ${
                  location.pathname === item.path ? 'bg-primary text-primary-content' : ''
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default AdminNavigation
