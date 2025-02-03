const mongoose = require('mongoose');

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

// Calculate total price
cartSchema.methods.calculateTotal = function() {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  return this.totalPrice;
};

// Add or update item in cart
cartSchema.methods.addItem = async function(productId, quantity, price) {
  const existingItem = this.items.find(item => 
    item.productId.toString() === productId.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({ productId, quantity, price });
  }

  this.calculateTotal();
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