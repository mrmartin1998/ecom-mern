const mongoose = require('mongoose');
const Product = require('./product.model');
const { AppError } = require('../utils/errorHandler');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity cannot be less than 1'],
      default: 1
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    }
  }],
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

// Validate stock and price before saving
cartSchema.pre('save', async function(next) {
  try {
    for (const item of this.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new AppError('PRODUCT_NOT_FOUND', `Product ${item.productId} not found`, 404);
      }
      
      // Check stock availability
      if (!product.checkAvailability(item.quantity)) {
        throw new AppError('INSUFFICIENT_STOCK', 
          `Only ${product.stockQuantity} units available for ${product.name}`, 400);
      }
      
      // Verify price hasn't changed
      if (product.price !== item.price) {
        throw new AppError('PRICE_CHANGED', 
          `Price for ${product.name} has changed to ${product.formatPrice()}`, 400);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Calculate total price
cartSchema.methods.calculateTotal = function() {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  return this.totalPrice;
};

// Add or update item with validation
cartSchema.methods.addItem = async function(productId, quantity) {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('PRODUCT_NOT_FOUND', 'Product not found', 404);
  }

  const existingItem = this.items.find(item => 
    item.productId.toString() === productId.toString()
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (!product.checkAvailability(newQuantity)) {
      throw new AppError('INSUFFICIENT_STOCK', 
        `Only ${product.stockQuantity} units available`, 400);
    }
    existingItem.quantity = newQuantity;
    existingItem.price = product.price; // Update price
  } else {
    if (!product.checkAvailability(quantity)) {
      throw new AppError('INSUFFICIENT_STOCK', 
        `Only ${product.stockQuantity} units available`, 400);
    }
    this.items.push({ 
      productId, 
      quantity, 
      price: product.price 
    });
  }

  await this.calculateTotal();
  return this.save();
};

// Remove item from cart
cartSchema.methods.removeItem = async function(productId) {
  this.items = this.items.filter(item => 
    item.productId.toString() !== productId.toString()
  );
  
  this.calculateTotal();
  return this.save();
};

// Clear cart
cartSchema.methods.clearCart = async function() {
  this.items = [];
  this.totalPrice = 0;
  return this.save();
};

module.exports = mongoose.model('Cart', cartSchema); 