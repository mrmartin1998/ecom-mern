const express = require('express');
const router = express.Router();
const { register, login, logout, refreshToken, verifyEmail } = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../middleware/validators/auth.validator');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const auth = require('../middleware/auth');

// Apply rate limiting to auth routes
router.use(authLimiter);

// Auth routes
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/logout', auth(), logout);
router.post('/refresh-token', refreshToken);
router.get('/verify-email', verifyEmail);

module.exports = router; 