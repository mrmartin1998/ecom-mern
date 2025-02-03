const BaseController = require('./base.controller');
const Order = require('../models/order.model');
const { AppError } = require('../utils/errorHandler');

class OrderController extends BaseController {
  constructor() {
    super(Order);
  }

  // Override store to handle order creation with validation
  store = async (req, res) => {
    try {
      const { items, shippingAddress } = req.body;
      const order = new Order({
        userId: req.userId,
        items,
        shippingAddress
      });
      
      await order.calculateTotal();
      await order.save();

      res.status(201).json({
        success: true,
        data: order,
        error: null,
        meta: null
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message
        },
        meta: null
      });
    }
  }

  // Update order status
  updateStatus = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        throw new AppError('NOT_FOUND', 'Order not found', 404);
      }

      await order.updateStatus(req.body.status);

      res.json({
        success: true,
        data: order,
        error: null,
        meta: null
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        success: false,
        data: null,
        error: {
          code: error.code || 'OPERATION_FAILED',
          message: error.message
        },
        meta: null
      });
    }
  }

  // Update payment status
  updatePaymentStatus = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        throw new AppError('NOT_FOUND', 'Order not found', 404);
      }

      await order.updatePaymentStatus(req.body.status);

      res.json({
        success: true,
        data: order,
        error: null,
        meta: null
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        success: false,
        data: null,
        error: {
          code: error.code || 'OPERATION_FAILED',
          message: error.message
        },
        meta: null
      });
    }
  }
}

module.exports = OrderController; 