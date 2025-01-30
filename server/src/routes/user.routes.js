const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { register, login } = require('../controllers/auth.controller');
const bcrypt = require('bcryptjs');

// Handles GET to /api/users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Handles POST to /api/users
router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username,
      email,
      password: hashedPassword
    });
    
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add this new route
router.post('/login', login);

module.exports = router; 