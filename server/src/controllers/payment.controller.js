const Order = require('../models/order.model');
const StripeService = require('../services/stripe.service');
const { AppError } = require('../utils/errorHandler');

class PaymentController {
  constructor() {
    // Bind the methods to ensure 'this' context
    this.handlePaymentSuccess = this.handlePaymentSuccess.bind(this);
    this.handlePaymentFailure = this.handlePaymentFailure.bind(this);
  }

  // Create payment intent
  async createPaymentIntent(req, res) {
    try {
      const order = await Order.findOne({
        _id: req.params.orderId,
        userId: req.userId
      });

      if (!order) {
        throw new AppError('NOT_FOUND', 'Order not found', 404);
      }

      if (order.paymentStatus !== 'pending') {
        throw new AppError('INVALID_PAYMENT', 
          'Order is already paid or cancelled', 400);
      }

      const paymentIntent = await StripeService.createPaymentIntent(order);
      
      order.paymentIntentId = paymentIntent.id;
      await order.save();

      res.json({
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret
        },
        error: null,
        meta: null
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'PAYMENT_INTENT_FAILED',
          message: error.message
        }
      });
    }
  }

  // Handle Stripe webhooks
  handleWebhook = async (req, res, next) => {
    try {
      const signature = req.headers['stripe-signature'];
      const event = await StripeService.handleWebhook(signature, req.body);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
        // Add other event types as needed
      }

      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  }

  // Handle successful payment (internal method)
  handlePaymentSuccess = async (paymentIntent) => {
    const order = await Order.findOne({ 
      paymentIntentId: paymentIntent.id 
    });

    if (!order) return;

    await order.updatePaymentStatus('completed');
    await order.updateStatus('processing');
  }

  // Handle failed payment (internal method)
  handlePaymentFailure = async (paymentIntent) => {
    const order = await Order.findOne({ 
      paymentIntentId: paymentIntent.id 
    });

    if (!order) return;

    await order.updatePaymentStatus('failed');
  }

  async confirmPayment(req, res) {
    try {
      // Implementation for confirming payment
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'PAYMENT_CONFIRMATION_FAILED',
          message: error.message
        }
      });
    }
  }

  async getPaymentStatus(req, res) {
    try {
      // Implementation for getting payment status
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'PAYMENT_STATUS_FAILED',
          message: error.message
        }
      });
    }
  }
}

module.exports = PaymentController; 