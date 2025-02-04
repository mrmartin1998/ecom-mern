const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { AppError } = require('../utils/errorHandler');
const TokenService = require('../services/token.service');

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
    
    // Create new user (let the schema middleware handle password hashing)
    const user = new User({
      username,
      email,
      password,
      role: 'customer'
    });
    
    await user.save();
    console.log('User registered successfully:', email);
    
    res.status(201).json({
      success: true,
      data: {
        user: user.toJSON()
      },
      error: null
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        data: null,
        error: {
          code: error.code,
          message: error.message
        }
      });
    } else {
      res.status(500).json({
        success: false,
        data: null,
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
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

module.exports = {
  register,
  login,
  logout,
  refreshToken
}; 