const mongoose = require('mongoose');
const Product = require('./product.model');
const Cart = require('./cart.model');
const { AppError } = require('../utils/errorHandler');

const orderSchema = new mongoose.Schema({
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
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  shippingAddress: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
      match: [/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    }
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String,
    sparse: true
  }
}, {
  timestamps: true
});

// Validate stock before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('items')) {
    try {
      for (const item of this.items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new AppError('PRODUCT_NOT_FOUND', 
            `Product ${item.productId} not found`, 404);
        }
        
        if (!product.checkAvailability(item.quantity)) {
          throw new AppError('INSUFFICIENT_STOCK', 
            `Only ${product.stockQuantity} units available for ${product.name}`, 400);
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Create order from cart
orderSchema.statics.createFromCart = async function(userId, cart, shippingAddress) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate and update stock
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new AppError('PRODUCT_NOT_FOUND', 
          `Product ${item.productId} not found`, 404);
      }
      
      if (!product.checkAvailability(item.quantity)) {
        throw new AppError('INSUFFICIENT_STOCK', 
          `Only ${product.stockQuantity} units available for ${product.name}`, 400);
      }
      
      await product.updateStock(-item.quantity);
    }

    // Create order
    const order = new this({
      userId,
      items: cart.items,
      totalAmount: cart.totalPrice,
      shippingAddress
    });

    await order.save({ session });
    
    // Clear cart
    await Cart.findByIdAndDelete(cart._id, { session });
    
    await session.commitTransaction();
    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Status transition validation
const validTransitions = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: []
};

// Update order status with validation
orderSchema.methods.updateStatus = async function(newStatus) {
  const currentStatus = this.orderStatus;
  
  if (currentStatus === newStatus) return this;
  
  if (!validTransitions[currentStatus].includes(newStatus)) {
    throw new AppError('INVALID_TRANSITION', 
      `Cannot transition from ${currentStatus} to ${newStatus}`, 400);
  }
  
  this.orderStatus = newStatus;
  return this.save();
};

// Calculate total amount
orderSchema.methods.calculateTotal = function() {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  return this.totalAmount;
};

// Update payment status
orderSchema.methods.updatePaymentStatus = async function(status) {
  if (this.paymentStatus === status) return this;
  
  if (!this.schema.path('paymentStatus').enumValues.includes(status)) {
    throw new Error('Invalid payment status');
  }
  
  this.paymentStatus = status;
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema); 