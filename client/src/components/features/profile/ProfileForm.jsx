import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import profileService from '../../../services/profile.service';
import { Input } from '../../common/forms/Input';

const ProfileForm = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    preferences: {
      notifications: false,
      newsletter: false
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        preferences: user.preferences || {
          notifications: false,
          newsletter: false
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await profileService.updateProfile(formData);
      updateUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Phone"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />

      <div className="space-y-3">
        <h3 className="text-lg font-medium">Address</h3>
        <Input
          label="Street"
          name="address.street"
          value={formData.address.street}
          onChange={handleChange}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
          />
          <Input
            label="State"
            name="address.state"
            value={formData.address.state}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="ZIP Code"
            name="address.zipCode"
            value={formData.address.zipCode}
            onChange={handleChange}
          />
          <Input
            label="Country"
            name="address.country"
            value={formData.address.country}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Preferences</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="preferences.notifications"
            checked={formData.preferences.notifications}
            onChange={handleChange}
            className="rounded border-gray-300"
          />
          <span>Receive notifications</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="preferences.newsletter"
            checked={formData.preferences.newsletter}
            onChange={handleChange}
            className="rounded border-gray-300"
          />
          <span>Subscribe to newsletter</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default ProfileForm; 