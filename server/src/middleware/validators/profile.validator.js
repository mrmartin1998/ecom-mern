const { body } = require('express-validator');

const validateProfile = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .withMessage('Invalid phone number format'),
  
  body('address.street').optional().trim(),
  body('address.city').optional().trim(),
  body('address.state').optional().trim(),
  body('address.zipCode').optional().trim(),
  body('address.country').optional().trim(),
  
  body('preferences.notifications').optional().isBoolean(),
  body('preferences.newsletter').optional().isBoolean()
];

const validateEmail = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
];

const validatePassword = [
  body('currentPassword')
    .trim()
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/)
    .withMessage('Password must contain at least one letter and one number')
];

module.exports = {
  validateProfile,
  validateEmail,
  validatePassword
}; 