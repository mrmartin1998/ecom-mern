import { useState } from 'react';
import ProfileForm from './ProfileForm';
import PasswordChangeForm from './PasswordChangeForm';
import DeleteAccountModal from './DeleteAccountModal';
import { Card } from '../../common/ui/Card';

const ProfileLayout = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      <div className="space-y-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <ProfileForm />
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <PasswordChangeForm />
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Danger Zone</h2>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Account
          </button>
        </Card>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default ProfileLayout; 