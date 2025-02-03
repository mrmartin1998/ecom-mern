const BaseController = require('./base.controller');
const Cart = require('../models/cart.model');
const { AppError } = require('../utils/errorHandler');

class CartController extends BaseController {
  constructor() {
    super(Cart);
  }

  // Override store to handle cart creation with items
  store = async (req, res) => {
    try {
      const { userId, items } = req.body;
      const cart = new Cart({ userId, items });
      await cart.calculateTotal();
      await cart.save();

      res.status(201).json({
        success: true,
        data: cart,
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

  // Add item to cart
  addItem = async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.userId });
      if (!cart) {
        throw new AppError('NOT_FOUND', 'Cart not found', 404);
      }

      const { productId, quantity, price } = req.body;
      await cart.addItem(productId, quantity, price);

      res.json({
        success: true,
        data: cart,
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

  // Remove item from cart
  removeItem = async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.userId });
      if (!cart) {
        throw new AppError('NOT_FOUND', 'Cart not found', 404);
      }

      await cart.removeItem(req.params.productId);

      res.json({
        success: true,
        data: cart,
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

module.exports = CartController; 