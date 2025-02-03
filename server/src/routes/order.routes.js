const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const orderController = new OrderController();

router.get('/', auth, orderController.index);
router.get('/:id', auth, orderController.show);
router.post('/', auth, orderController.store);
router.patch('/:id/status', auth, orderController.updateStatus);
router.patch('/:id/payment', auth, orderController.updatePaymentStatus);
router.delete('/:id', auth, orderController.delete);

module.exports = router; 