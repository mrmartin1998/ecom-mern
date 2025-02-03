const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/.test(v);
      },
      message: 'Invalid image URL format'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['electronics', 'clothing', 'books', 'home', 'other']
  }
}, {
  timestamps: true
});

// Method to check stock availability
productSchema.methods.checkAvailability = function(quantity) {
  return this.stockQuantity >= quantity;
};

// Method to update stock
productSchema.methods.updateStock = async function(quantity) {
  if (this.stockQuantity + quantity < 0) {
    throw new Error('Insufficient stock');
  }
  this.stockQuantity += quantity;
  return this.save();
};

// Method to format price (e.g., for display)
productSchema.methods.formatPrice = function() {
  return `$${this.price.toFixed(2)}`;
};

module.exports = mongoose.model('Product', productSchema); 