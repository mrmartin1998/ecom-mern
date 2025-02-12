const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');

const authController = new AuthController();

// Auth routes
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.get('/verify-email', authController.verifyEmail.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));
router.post('/forgot-password', authController.forgotPassword.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));
router.get('/validate-token', authController.validateToken.bind(authController));
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router; 