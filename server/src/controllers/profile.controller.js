const User = require('../models/user.model');

const profileController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update profile
  updateProfile: async (req, res) => {
    try {
      const { username, phone, address, preferences } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user.id,
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

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update email with verification
  updateEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findById(req.user.id);
      
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
  },

  // Delete account
  deleteAccount: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.user.id);
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = profileController; 