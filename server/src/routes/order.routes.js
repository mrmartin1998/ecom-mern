const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { 
  createOrderValidator, 
  updateStatusValidator, 
  updatePaymentValidator 
} = require('../middleware/validators/order.validator');

const orderController = new OrderController();

// User routes
router.get('/', auth, orderController.index);
router.get('/:id', auth, orderController.show);
router.post('/', auth, createOrderValidator, validate, orderController.store);

// Status updates (some restricted to admin)
router.patch('/:id/status', 
  auth, 
  updateStatusValidator, 
  validate, 
  orderController.updateStatus
);

// Admin only routes
router.patch('/:id/payment', 
  auth, 
  updatePaymentValidator, 
  validate, 
  orderController.updatePaymentStatus
);

router.delete('/:id', auth, orderController.delete);

module.exports = router; 