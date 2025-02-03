const { AppError } = require('../utils/errorHandler');

class StripeService {
  static #stripe;

  static initialize() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new AppError('CONFIG_ERROR', 
        'Stripe secret key is not configured', 500);
    }
    if (!this.#stripe) {
      this.#stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    }
    return this.#stripe;
  }

  static async createPaymentIntent(order) {
    try {
      const stripe = this.initialize();
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.totalAmount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          orderId: order._id.toString(),
          userId: order.userId.toString()
        }
      });

      return paymentIntent;
    } catch (error) {
      throw new AppError('PAYMENT_ERROR', 
        'Failed to create payment intent', 500);
    }
  }

  static async handleWebhook(signature, payload) {
    try {
      const stripe = this.initialize();
      
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        throw new AppError('CONFIG_ERROR', 
          'Stripe webhook secret is not configured', 500);
      }

      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      return event;
    } catch (error) {
      throw new AppError('WEBHOOK_ERROR', 
        'Invalid webhook signature', 400);
    }
  }

  static async createRefund(paymentIntentId, amount) {
    try {
      const stripe = this.initialize();
      
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: Math.round(amount * 100)
      });

      return refund;
    } catch (error) {
      throw new AppError('REFUND_ERROR', 
        'Failed to process refund', 500);
    }
  }
}

module.exports = StripeService; 