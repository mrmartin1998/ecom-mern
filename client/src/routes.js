import EmailVerification from '@/components/features/auth/EmailVerification';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import ProfilePage from '@/pages/profile/page';

const routes = [
  {
    path: '/auth/verify-email',
    element: <EmailVerification />,
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    )
  },
];

export const router = createBrowserRouter(routes);

export default routes; 