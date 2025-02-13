const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authorization header missing or invalid' }
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'No token provided' }
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user to check status
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: { message: 'User not found' }
        });
      }

      if (user.status === 'disabled') {
        return res.status(403).json({
          success: false,
          error: { 
            code: 'ACCOUNT_DISABLED',
            message: 'Your account has been disabled' 
          }
        });
      }

      req.user = {
        userId: user._id,
        role: user.role,
        status: user.status
      };
      next();
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid token' }
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
};

module.exports = authMiddleware; 