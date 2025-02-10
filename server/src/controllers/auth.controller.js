const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { AppError } = require('../utils/errorHandler');
const TokenService = require('../services/token.service');
const EmailService = require('../services/email.service');
const crypto = require('crypto');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Registration attempt for:', email);
    
    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      throw new AppError(
        'DUPLICATE_USER',
        'User with this email or username already exists',
        409
      );
    }
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    console.log('Generated verification token:', verificationToken);

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: 'customer',
      email_verified: false,
      verification_token: verificationToken,
      verification_expiry: tokenExpiry
    });

    await user.save();
    
    // Verify the user was saved correctly
    const savedUser = await User.findOne({ email });
    console.log('Saved user verification token:', savedUser.verification_token);
    console.log('Token matches:', savedUser.verification_token === verificationToken);

    try {
      await EmailService.sendVerificationEmail(email, verificationToken);
      console.log('Verification email sent successfully');
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(201).json({
        success: true,
        data: {
          user: user.toJSON(),
          message: 'Account created but verification email could not be sent. Please contact support.'
        },
        warning: 'Verification email could not be sent'
      });
    }

    console.log('Registration completed successfully');
    
    res.status(201).json({
      success: true,
      data: {
        user: user.toJSON(),
        message: 'Please check your email to verify your account'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      data: null,
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
    console.log('Verifying email with token:', token);

    if (!token) {
      throw new AppError('MISSING_TOKEN', 'Verification token is required', 400);
    }

    // Find user with matching token
    const user = await User.findOne({
      $or: [
        { verification_token: token },
        { email_verified: true } // Check if a user was already verified with this token
      ]
    });

    console.log('Found user:', user ? user.email : 'No user found');

    if (!user) {
      throw new AppError('INVALID_TOKEN', 'Invalid verification token', 400);
    }

    // Check if already verified
    if (user.email_verified) {
      return res.json({
        success: true,
        data: {
          message: 'Email already verified',
          isAlreadyVerified: true
        },
        error: null
      });
    }

    // Check token expiry
    if (user.verification_expiry && user.verification_expiry < Date.now()) {
      throw new AppError('EXPIRED_TOKEN', 'Verification token has expired', 400);
    }

    // Update user verification status
    user.email_verified = true;
    user.verification_token = undefined;
    user.verification_expiry = undefined;
    await user.save();

    console.log('Email verified successfully for:', user.email);

    res.json({
      success: true,
      data: {
        message: 'Email verified successfully',
        isAlreadyVerified: false
      },
      error: null
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      data: null,
      error: {
        code: error.code || 'SERVER_ERROR',
        message: error.message || 'An unexpected error occurred'
      }
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  verifyEmail
}; 