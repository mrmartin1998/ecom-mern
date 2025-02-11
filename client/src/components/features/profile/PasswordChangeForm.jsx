import { useState } from 'react';
import { toast } from 'react-toastify';
import profileService from '../../../services/profile.service';
import { Input } from '../../common/forms/Input';

const PasswordChangeForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return false;
    }
    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.newPassword)) {
      toast.error('Password must contain at least one letter and one number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await profileService.updatePassword(
        formData.currentPassword,
        formData.newPassword
      );
      toast.success('Password updated successfully');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Current Password"
        type="password"
        name="currentPassword"
        value={formData.currentPassword}
        onChange={handleChange}
        required
      />
      
      <Input
        label="New Password"
        type="password"
        name="newPassword"
        value={formData.newPassword}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Confirm New Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />

      <div className="text-sm text-gray-600">
        <p>Password requirements:</p>
        <ul className="list-disc list-inside">
          <li>At least 8 characters long</li>
          <li>Must contain at least one letter and one number</li>
        </ul>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  );
};

export default PasswordChangeForm; 