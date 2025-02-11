import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import profileService from '../../../services/profile.service';
import { Input } from '../../common/forms/Input';
import { Modal } from '../../common/ui/Modal';

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error('Please enter your password to confirm');
      return;
    }

    setLoading(true);
    try {
      await profileService.deleteAccount(password);
      toast.success('Account deleted successfully');
      logout();
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Delete Account</h2>
        
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-red-50 text-red-800 rounded">
            <h3 className="font-semibold mb-2">Warning!</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>This action cannot be undone</li>
              <li>All your data will be permanently deleted</li>
              <li>You will lose access to all your account information</li>
            </ul>
          </div>

          <form onSubmit={handleDelete} className="space-y-4">
            <Input
              type="password"
              label="Enter your password to confirm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal; 