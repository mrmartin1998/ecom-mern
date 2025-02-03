const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { addItemValidator, updateQuantityValidator } = require('../middleware/validators/cart.validator');
const { generalLimiter } = require('../middleware/rateLimiter');

const cartController = new CartController();

// Apply rate limiting
router.use(generalLimiter);

// Cart routes with validation
router.get('/', auth(), cartController.show);
router.post('/items', auth(), addItemValidator, validate, cartController.addItem);
router.patch('/items/:productId', auth(), updateQuantityValidator, validate, cartController.updateQuantity);
router.delete('/items/:productId', auth(), cartController.removeItem);
router.delete('/', auth(), cartController.clearCart);

module.exports = router; 