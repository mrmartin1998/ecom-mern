const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');

// Store for blacklisted tokens
const tokenBlacklist = new Set();

class TokenService {
  static generateToken(user) {
    return jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  static generateRefreshToken(user) {
    return jwt.sign(
      { 
        userId: user._id,
        version: user.tokenVersion
      },
      process.env.JWT_REFRESH_SECRET,
      { 
        expiresIn: '7d',
        algorithm: 'HS256'
      }
    );
  }

  static verifyToken(token) {
    try {
      if (tokenBlacklist.has(token)) {
        throw new AppError('INVALID_TOKEN', 'Token has been invalidated', 401);
      }
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError('TOKEN_EXPIRED', 'Token has expired', 401);
      }
      throw new AppError('INVALID_TOKEN', 'Invalid token', 401);
    }
  }

  static blacklistToken(token) {
    tokenBlacklist.add(token);
  }
}

module.exports = TokenService; 