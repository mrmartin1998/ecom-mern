const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');
const auth = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');

const paymentController = new PaymentController();

// Apply rate limiting to payment routes
router.use(paymentLimiter);

// Create payment intent
router.post(
  '/create-payment-intent/:orderId',
  auth(),
  paymentController.createPaymentIntent
);

// Webhook endpoint (no auth - called by Stripe)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

module.exports = router; 