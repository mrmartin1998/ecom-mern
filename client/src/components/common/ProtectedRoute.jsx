import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/config/routes';
import LoadingSpinner from './ui/LoadingSpinner';

const ProtectedRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  const { checkAuth, hasRole, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!checkAuth()) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !hasRole(roles)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export default ProtectedRoute; 