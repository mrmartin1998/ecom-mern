const adminErrorHandler = (err, req, res, next) => {
  console.error('Admin Error:', err);

  // Log admin errors
  auditService.log('ADMIN_ERROR', req.user?._id, null, {
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    endpoint: req.originalUrl
  });

  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'ADMIN_ERROR',
      message: err.message || 'An unexpected error occurred'
    }
  });
};

module.exports = adminErrorHandler; 