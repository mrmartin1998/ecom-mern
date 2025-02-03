const { AppError } = require('../utils/errorHandler');
const TokenService = require('../services/token.service');

const auth = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        throw new AppError('NO_TOKEN', 'Authentication required', 401);
      }
      
      const decoded = TokenService.verifyToken(token);
      
      // Check if user has required role
      if (roles.length && !roles.includes(decoded.role)) {
        throw new AppError('UNAUTHORIZED', 'Insufficient permissions', 403);
      }
      
      req.userId = decoded.userId;
      req.userRole = decoded.role;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = auth; 