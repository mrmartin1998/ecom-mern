const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: false,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  verification_token: String,
  verification_expiry: Date,
  reset_token: String,
  reset_token_expiry: Date,
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  preferences: {
    notifications: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.__v;
      delete ret.verification_token;
      delete ret.verification_expiry;
      return ret;
    }
  }
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('Comparing passwords...');
    console.log('Stored hash:', this.password);
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password match result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Password comparison error:', error);
    throw error;
  }
};

// Method to generate JWT
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const User = mongoose.model('User', userSchema);
module.exports = User; 