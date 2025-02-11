const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { paymentLimiter } = require('../middleware/rateLimiter');

const paymentController = new PaymentController();

// Apply rate limiting to payment routes
router.use(paymentLimiter);

// Create payment intent
router.post('/create-payment-intent', auth, paymentController.createPaymentIntent.bind(paymentController));
router.post('/confirm-payment', auth, paymentController.confirmPayment.bind(paymentController));
router.get('/payment-status/:paymentId', auth, paymentController.getPaymentStatus.bind(paymentController));

// Webhook endpoint (no auth - called by Stripe)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

module.exports = router; 