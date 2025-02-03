const { body, query } = require('express-validator');

const createProductValidator = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
    
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
    
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
    
  body('stockQuantity')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a positive integer'),
    
  body('category')
    .isIn(['electronics', 'clothing', 'books', 'home', 'other'])
    .withMessage('Invalid category')
];

const productQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
    
  query('sort')
    .optional()
    .isIn(['price_asc', 'price_desc', 'date_asc', 'date_desc'])
    .withMessage('Invalid sort parameter'),
    
  query('category')
    .optional()
    .isIn(['electronics', 'clothing', 'books', 'home', 'other'])
    .withMessage('Invalid category')
];

module.exports = {
  createProductValidator,
  productQueryValidator
}; 