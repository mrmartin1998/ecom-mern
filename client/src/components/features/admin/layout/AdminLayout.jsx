import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import AdminNavigation from './AdminNavigation'
import LoadingSpinner from '@/components/common/ui/LoadingSpinner'

const AdminLayout = ({ children }) => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Wait for auth to initialize
    if (!loading) {
      // Check if user exists and has admin role
      if (!user) {
        console.log('No user found, redirecting to login')
        navigate('/login')
      } else if (user.role !== 'admin') {
        console.log('User is not admin, redirecting to home')
        navigate('/')
      }
    }
  }, [user, loading, navigate])

  // Show loading state while checking auth
  if (loading) {
    return <LoadingSpinner />
  }

  // Only render if user is admin
  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Admin Sidebar Navigation */}
      <AdminNavigation />
      
      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
