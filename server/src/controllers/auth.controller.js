const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { AppError } = require('../utils/errorHandler');
const TokenService = require('../services/token.service');
const crypto = require('crypto');
const EmailService = require('../services/email.service');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Registration attempt for:', email);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create username from email if not provided
    const username = email.split('@')[0];

    const user = new User({
      email,
      password,
      username,
      verification_token: verificationToken,
      verification_expiry: verificationExpiry
    });

    await user.save();
    
    // Send verification email
    await EmailService.sendVerificationEmail(email, verificationToken);
    console.log('Email sent:', email);

    res.status(201).json({
      success: true,
      data: {
        message: 'Registration successful. Please check your email to verify your account.'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: {
        code: error.code || 'SERVER_ERROR',
        message: error.message || 'An unexpected error occurred'
      }
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    if (!user) {
      console.log('User not found for email:', email);
      throw new AppError('AUTH_FAILED', 'Invalid credentials', 401);
    }
    
    console.log('User found, comparing passwords...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      throw new AppError('AUTH_FAILED', 'Invalid credentials', 401);
    }
    
    // Generate token
    const token = jwt.sign(
      { 
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '24h',
        algorithm: 'HS256'
      }
    );
    
    console.log('Login successful for:', email);
    
    res.json({
      success: true,
      data: {
        token,
        user: user.toJSON()
      },
      error: null,
      meta: {
        tokenExpires: '24h'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      data: null,
      error: {
        code: error.code || 'SERVER_ERROR',
        message: error.message || 'An unexpected error occurred'
      },
      meta: null
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      TokenService.blacklistToken(token);
    }
    
    res.json({
      success: true,
      data: null,
      error: null,
      meta: null
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      data: null,
      error: {
        code: error.code || 'SERVER_ERROR',
        message: error.message || 'An unexpected error occurred'
      },
      meta: null
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError('NO_TOKEN', 'Refresh token required', 400);
    }
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user || decoded.version !== user.tokenVersion) {
      throw new AppError('INVALID_TOKEN', 'Invalid refresh token', 401);
    }
    
    const newToken = TokenService.generateToken(user);
    
    res.json({
      success: true,
      data: {
        token: newToken
      },
      error: null,
      meta: {
        tokenExpires: '24h'
      }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      data: null,
      error: {
        code: error.code || 'SERVER_ERROR',
        message: error.message || 'An unexpected error occurred'
      },
      meta: null
    });
  }
};

// New endpoint for email verification
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    console.log('Received verification request with token:', token);

    if (!token) {
      console.log('No token provided');
      return res.status(400).json({
        success: false,
        error: {
          message: 'Verification token is required'
        }
      });
    }

    const user = await User.findOne({ 
      verification_token: token,
      verification_expiry: { $gt: Date.now() }
    });

    console.log('Found user:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('Invalid or expired token');
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid or expired verification token'
        }
      });
    }

    user.email_verified = true;
    user.verification_token = undefined;
    user.verification_expiry = undefined;
    await user.save();
    console.log('User verified successfully');

    return res.json({
      success: true,
      data: {
        message: 'Email verified successfully'
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Failed to verify email'
      }
    });
  }
};
//
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.json({
        success: true,
        data: {
          message: 'If your email is registered, you will receive password reset instructions.'
        }
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000);

    user.reset_token = resetToken;
    user.reset_token_expiry = resetExpiry;
    await user.save();

    await EmailService.sendPasswordResetEmail(email, resetToken);

    res.json({
      success: true,
      data: {
        message: 'Password reset instructions sent to your email.'
      }
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to process password reset request'
      }
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Find user with valid reset token
    const user = await User.findOne({
      reset_token: token,
      reset_token_expiry: { $gt: Date.now() }
    });

    if (!user) {
      throw new AppError('INVALID_TOKEN', 'Invalid or expired reset token', 400);
    }

    // Update password and clear reset token
    user.password = password;
    user.reset_token = undefined;
    user.reset_token_expiry = undefined;
    await user.save();

    res.json({
      success: true,
      data: {
        message: 'Password successfully reset'
      }
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: {
        code: error.code || 'SERVER_ERROR',
        message: error.message || 'Failed to reset password'
      }
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword
}; 