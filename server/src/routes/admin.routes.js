const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth.middleware');
const adminController = require('../controllers/admin.controller');

// Apply both middleware to all admin routes
router.use(auth);
router.use(adminAuth);

// User management routes
router.get('/users', adminController.getUsersList);
router.put('/users/:userId/role', adminController.updateUserRole);
router.put('/users/:userId/status', adminController.updateUserStatus);

// Keep the health check route
router.get('/status', (req, res) => {
  res.json({ success: true, message: 'Admin API operational' });
});

// Add with existing routes
router.get('/metrics', adminController.getSystemMetrics);
router.get('/logs', adminController.getAuditLogs);

module.exports = router; 