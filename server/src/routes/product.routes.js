const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const auth = require('../middleware/auth');
const { createProductValidator, productQueryValidator } = require('../middleware/validators/product.validator');
const validate = require('../middleware/validate');
const { generalLimiter } = require('../middleware/rateLimiter');

const productController = new ProductController();

// Public routes with rate limiting
router.get('/', generalLimiter, productQueryValidator, validate, productController.index);
router.get('/:id', generalLimiter, productController.show);

// Admin only routes
router.post('/', auth(['admin']), createProductValidator, validate, productController.store);
router.put('/:id', auth(['admin']), createProductValidator, validate, productController.update);
router.delete('/:id', auth(['admin']), productController.delete);
router.post('/bulk', auth(['admin']), productController.bulkUpdate);

module.exports = router; 