const { body } = require('express-validator');

const registerValidator = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[A-Z])(?=.*[0-9])/)
    .withMessage('Password must contain at least one uppercase letter and one number'),
  
  body('role')
    .optional()
    .isIn(['customer', 'admin'])
    .withMessage('Invalid role specified')
];

const loginValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

module.exports = {
  registerValidator,
  loginValidator
}; 