const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { registerValidator } = require('../middleware/validators/auth.validator');
const validate = require('../middleware/validate');
const rateLimiter = require('../middleware/rateLimiter');

// Apply rate limiting to auth routes
router.use(rateLimiter);

// Registration with validation
router.post('/register', registerValidator, validate, register);

// Login (keeping existing route)
router.post('/login', login);

module.exports = router; 