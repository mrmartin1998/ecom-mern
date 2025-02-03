const BaseController = require('./base.controller');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const { AppError } = require('../utils/errorHandler');

class OrderController extends BaseController {
  constructor() {
    super(Order);
  }

  // Create order from cart
  store = async (req, res, next) => {
    try {
      const cart = await Cart.findOne({ userId: req.userId });
      if (!cart || cart.items.length === 0) {
        throw new AppError('CART_EMPTY', 'Cart is empty', 400);
      }

      const order = await Order.createFromCart(
        req.userId,
        cart,
        req.body.shippingAddress
      );

      await order.populate('items.productId', 'name imageUrl');

      res.status(201).json({
        success: true,
        data: order,
        error: null,
        meta: null
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user's orders with filtering and pagination
  index = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const status = req.query.status;
      const sort = req.query.sort || '-createdAt';

      const query = { userId: req.userId };
      if (status) {
        query.orderStatus = status;
      }

      const orders = await Order.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('items.productId', 'name imageUrl');

      const total = await Order.countDocuments(query);

      res.json({
        success: true,
        data: orders,
        error: null,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Update order status with role validation
  updateStatus = async (req, res, next) => {
    try {
      const order = await Order.findOne({
        _id: req.params.id,
        userId: req.userId
      });

      if (!order) {
        throw new AppError('NOT_FOUND', 'Order not found', 404);
      }

      // Only admins can update to certain statuses
      if (['shipped', 'delivered'].includes(req.body.status) && 
          req.userRole !== 'admin') {
        throw new AppError('UNAUTHORIZED', 
          'Only admins can update to this status', 403);
      }

      await order.updateStatus(req.body.status);
      await order.populate('items.productId', 'name imageUrl');

      res.json({
        success: true,
        data: order,
        error: null,
        meta: null
      });
    } catch (error) {
      next(error);
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