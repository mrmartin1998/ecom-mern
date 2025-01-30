const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
require('dotenv').config();
const userRoutes = require('./routes/user.routes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware Stack (requests flow through these in order):
app.use(cors());                    // Allows frontend to make requests
app.use(helmet());                  // Adds security headers
app.use(morgan('dev'));            // Logs requests to console
app.use(express.json());           // Parses incoming JSON
app.use(express.urlencoded({ extended: true }));

// Custom logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();  // Passes request to next middleware
});

// Routes
app.use('/api/users', userRoutes);  // Routes to correct handler

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the MERN API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 