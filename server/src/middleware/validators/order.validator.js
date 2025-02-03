const { body } = require('express-validator');

const createOrderValidator = [
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
    
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
    
  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
    
  body('shippingAddress.zipCode')
    .trim()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Invalid ZIP code format'),
    
  body('shippingAddress.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
];

const updateStatusValidator = [
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
];

const updatePaymentValidator = [
  body('status')
    .isIn(['pending', 'completed', 'failed', 'refunded'])
    .withMessage('Invalid payment status')
];

module.exports = {
  createOrderValidator,
  updateStatusValidator,
  updatePaymentValidator
}; 