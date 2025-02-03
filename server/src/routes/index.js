const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const cartRoutes = require('./cart.routes');
const orderRoutes = require('./order.routes');

// Auth routes
router.use('/auth', authRoutes);

// User routes
router.use('/users', userRoutes);

// Cart routes
router.use('/carts', cartRoutes);

// Order routes
router.use('/orders', orderRoutes);

module.exports = router; 