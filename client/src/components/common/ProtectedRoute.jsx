import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

const ProtectedRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  const isAuthenticated = false; // This will come from auth context later
  const userRole = null; // This will come from auth context later

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export default ProtectedRoute; 