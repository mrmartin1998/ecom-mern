const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { AppError } = require('../utils/errorHandler');
const TokenService = require('../services/token.service');
const crypto = require('crypto');
const EmailService = require('../services/email.service');

class AuthController {
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
      await user.save();
      console.log('New user created with ID:', user._id);

      // Generate token
      const token = user.generateAuthToken();

      res.status(201).json({
        success: true,
        data: {
          user: { id: user._id, email: user.email },
          token
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: error.message
        }
      });
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
    // Implement email verification
    res.json({ success: true });
  }

  async refreshToken(req, res) {
    // Implement token refresh
    res.json({ success: true });
  }

  async forgotPassword(req, res) {
    // Implement forgot password
    res.json({ success: true });
  }

  async resetPassword(req, res) {
    // Implement reset password
    res.json({ success: true });
  }

  async validateToken(req, res) {
    // Implement token validation
    res.json({ success: true });
  }
}

module.exports = AuthController; 