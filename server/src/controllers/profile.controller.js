const User = require('../models/user.model');
const bcrypt = require('bcryptjs');  // Add this for password hashing

class ProfileController {
  // Get user profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update profile
  async updateProfile(req, res) {
    try {
      console.log('Update Profile - Request Body:', req.body);
      console.log('Update Profile - User ID:', req.user.userId);
      
      const { username, phone, address, preferences } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { 
          $set: {
            username,
            phone,
            address,
            preferences
          }
        },
        { new: true, runValidators: true }
      ).select('-password');

      console.log('Update Profile - Updated User:', user);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Update Profile Error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Update email with verification
  async updateEmail(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findById(req.user.userId);
      
      // Check if email is already in use
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // Generate verification token
      user.verification_token = crypto.randomBytes(32).toString('hex');
      user.verification_expiry = Date.now() + 24*60*60*1000; // 24 hours
      await user.save();

      // TODO: Send verification email using email service
      
      res.json({ message: 'Verification email sent' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Delete account
  async deleteAccount(req, res) {
    try {
      await User.findByIdAndDelete(req.user.userId);
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Add updatePassword method
  async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      // Get user with password
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      
      await user.save();

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Update Password Error:', error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = ProfileController; 