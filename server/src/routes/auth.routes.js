const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  logout, 
  refreshToken, 
  verifyEmail,
  forgotPassword,
  resetPassword 
} = require('../controllers/auth.controller');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/verify-email', verifyEmail);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router; 