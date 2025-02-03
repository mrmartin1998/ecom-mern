const BaseController = require('./base.controller');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const { AppError } = require('../utils/errorHandler');

class CartController extends BaseController {
  constructor() {
    super(Cart);
  }

  // Get user's cart with populated product details
  show = async (req, res, next) => {
    try {
      const cart = await Cart.findOne({ userId: req.userId })
        .populate('items.productId', 'name imageUrl stockQuantity');
      
      if (!cart) {
        throw new AppError('NOT_FOUND', 'Cart not found', 404);
      }

      // Recalculate total to ensure accuracy
      await cart.calculateTotal();
      await cart.save();

      res.json({
        success: true,
        data: cart,
        error: null,
        meta: null
      });
    } catch (error) {
      next(error);
    }
  }

  // Add item to cart with validation
  addItem = async (req, res, next) => {
    try {
      let cart = await Cart.findOne({ userId: req.userId });
      if (!cart) {
        cart = new Cart({ userId: req.userId, items: [] });
      }

      const { productId, quantity } = req.body;
      await cart.addItem(productId, quantity);

      // Populate product details for response
      await cart.populate('items.productId', 'name imageUrl stockQuantity');

      res.json({
        success: true,
        data: cart,
        error: null,
        meta: null
      });
    } catch (error) {
      next(error);
    }
  }

  // Update item quantity with stock validation
  updateQuantity = async (req, res, next) => {
    try {
      const cart = await Cart.findOne({ userId: req.userId });
      if (!cart) {
        throw new AppError('NOT_FOUND', 'Cart not found', 404);
      }

      const { productId } = req.params;
      const { quantity } = req.body;

      const item = cart.items.find(item => 
        item.productId.toString() === productId
      );

      if (!item) {
        throw new AppError('NOT_FOUND', 'Item not found in cart', 404);
      }

      const product = await Product.findById(productId);
      if (!product) {
        throw new AppError('PRODUCT_NOT_FOUND', 'Product not found', 404);
      }

      if (!product.checkAvailability(quantity)) {
        throw new AppError('INSUFFICIENT_STOCK', 
          `Only ${product.stockQuantity} units available`, 400);
      }

      item.quantity = quantity;
      item.price = product.price; // Update to latest price
      await cart.calculateTotal();
      await cart.save();

      await cart.populate('items.productId', 'name imageUrl stockQuantity');

      res.json({
        success: true,
        data: cart,
        error: null,
        meta: null
      });
    } catch (error) {
      next(error);
    }
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

  // Add clearCart method
  clearCart = async (req, res, next) => {
    try {
      const cart = await Cart.findOne({ userId: req.userId });
      
      if (!cart) {
        throw new AppError('NOT_FOUND', 'Cart not found', 404);
      }

      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();

      res.json({
        success: true,
        data: cart,
        error: null,
        meta: null
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartController; 