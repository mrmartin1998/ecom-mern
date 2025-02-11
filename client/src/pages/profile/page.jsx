import { useAuth } from '@/context/AuthContext';
import ProfileForm from '@/components/features/profile/ProfileForm';
import ProfileLayout from '@/components/features/profile/ProfileLayout';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <ProfileLayout>
      <ProfileForm initialData={user} />
    </ProfileLayout>
  );
};

export default ProfilePage;
