import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileLayout from '../../components/features/profile/ProfileLayout';
import { LoadingSpinner } from '../../components/common/ui/LoadingSpinner';

const ProfilePage = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { 
        replace: true,
        state: { from: '/profile' }
      });
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ProfileLayout />
    </div>
  );
};

export default ProfilePage;
