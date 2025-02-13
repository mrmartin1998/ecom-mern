const adminAuth = async (req, res, next) => {
  try {
    // User is already authenticated from authMiddleware
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied. Admin privileges required.'
        }
      });
    }
    next();
  } catch (error) {
    console.error('Admin Auth Error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Authentication failed'
      }
    });
  }
};

module.exports = adminAuth; 