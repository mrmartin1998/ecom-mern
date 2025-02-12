const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { AppError } = require('../utils/errorHandler');
const TokenService = require('../services/token.service');
const crypto = require('crypto');
const EmailService = require('../services/email.service');

class AuthController {
  constructor() {
    this.emailService = new EmailService();
    this.tokenService = new TokenService();
  }

  async register(req, res) {
    try {
      const { email, password } = req.body;
      console.log('Registration attempt for email:', email);
      
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('User already exists');
        return res.status(400).json({
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'User already exists'
          }
        });
      }

      // Create new user
      const user = new User({ email, password });
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.verification_token = verificationToken;
      await user.save();
      console.log('New user created with ID:', user._id);

      // Send verification email
      console.log('Sending verification email to:', email);
      try {
        await this.emailService.sendVerificationEmail(email, verificationToken);
        console.log('Verification email sent successfully');
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't return here, just log the error
      }

      res.status(201).json({
        success: true,
        data: {
          user: {
            email: user.email,
            id: user._id
          }
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      console.log('Login request body:', req.body);
      const { email, password } = req.body;
      
      if (!email || !password) {
        console.log('Missing credentials - Email:', email, 'Password:', password ? 'provided' : 'missing');
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_CREDENTIALS',
            message: 'Email and password are required'
          }
        });
      }

      // Find user and verify password
      const user = await User.findOne({ email });
      console.log('User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password'
          }
        });
      }

      const isValidPassword = await user.comparePassword(password);
      console.log('Password validation result:', isValidPassword);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password'
          }
        });
      }

      // Generate token
      const token = user.generateAuthToken();

      res.json({
        success: true,
        data: {
          user: { id: user._id, email: user.email },
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: error.message
        }
      });
    }
  }

  async logout(req, res) {
    // Implement logout logic if needed
    res.json({ success: true });
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.query;
      console.log('Verifying email with token:', token);

      // Find user with verification token
      const user = await User.findOne({ verification_token: token });
      
      if (!user) {
        console.log('Invalid verification token');
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid verification token'
          }
        });
      }

      // Update user verification status
      user.email_verified = true;
      user.verification_token = undefined; // Clear the token
      await user.save();
      
      console.log('Email verified successfully for user:', user.email);

      res.json({
        success: true,
        message: 'Email verified successfully'
      });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'VERIFICATION_FAILED',
          message: error.message
        }
      });
    }
  }

  async refreshToken(req, res) {
    // Implement token refresh
    res.json({ success: true });
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      console.log('Forgot password request for:', email);

      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found for forgot password:', email);
        return res.status(404).json({ message: 'User not found' });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      await this.emailService.sendPasswordResetEmail(email, resetToken);
      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      console.log('Reset password attempt with token:', token);

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        console.log('Invalid or expired reset token');
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Password reset token is invalid or has expired'
          }
        });
      }

      // Let the User model's pre-save middleware handle the hashing
      user.password = password;
      
      // Clear reset token fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();
      console.log('Password successfully reset for user:', user.email);

      res.json({
        success: true,
        message: 'Password has been reset'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'RESET_FAILED',
          message: error.message
        }
      });
    }
  }

  async validateToken(req, res) {
    // Implement token validation
    res.json({ success: true });
  }

  async getCurrentUser(req, res) {
    try {
      console.log('Getting current user with ID:', req.user.userId);
      const user = await User.findById(req.user.userId).select('-password');
      
      if (!user) {
        console.log('User not found for ID:', req.user.userId);
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        });
      }

      // Set headers to prevent caching
      res.set('Cache-Control', 'no-store');
      res.set('Pragma', 'no-cache');
      
      console.log('Sending user data:', user);
      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            preferences: user.preferences,
            email_verified: user.email_verified,
            phone: user.phone,
            address: user.address
          }
        }
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error.message
        }
      });
    }
  }
}

module.exports = AuthController; 