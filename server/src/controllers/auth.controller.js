const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { AppError } = require('../utils/errorHandler');
const TokenService = require('../services/token.service');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
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
    
    // Create user with enhanced password hashing
    const salt = await bcrypt.genSalt(12); // Increased from 10 to 12 rounds
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: 'customer' // Force default role for security
    });
    
    await user.save();
    
    // Generate token with role
    const token = jwt.sign(
      { 
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '24h',
        algorithm: 'HS256' // Explicitly specify algorithm
      }
    );
    
    // Send response without password
    res.status(201).json({
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
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        data: null,
        error: {
          code: error.code,
          message: error.message
        },
        meta: null
      });
    } else {
      res.status(500).json({
        success: false,
        data: null,
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred'
        },
        meta: null
      });
    }
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('AUTH_FAILED', 'Invalid credentials', 401);
    }
    
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new AppError('AUTH_FAILED', 'Invalid credentials', 401);
    }
    
    const token = TokenService.generateToken(user);
    const refreshToken = TokenService.generateRefreshToken(user);
    
    res.json({
      success: true,
      data: {
        token,
        refreshToken,
        user: user.toJSON()
      },
      error: null,
      meta: {
        tokenExpires: '24h',
        refreshTokenExpires: '7d'
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