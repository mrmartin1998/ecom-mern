import { useAuth } from '@/context/AuthContext';
import ProfileForm from '@/components/features/profile/ProfileForm';
import ProfileLayout from '@/components/features/profile/ProfileLayout';

const ProfilePage = () => {
  return (
    <ProfileLayout>
      <ProfileForm />
    </ProfileLayout>
  );
};

export default ProfilePage;
