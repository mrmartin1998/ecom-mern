const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');
const { handleError, AppError } = require('./utils/errorHandler');
require('dotenv').config();
const routes = require('./routes');

const app = express();

// Connect to MongoDB
connectDB();

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100
});

// Middleware Stack (in required order)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());                  // Security headers
app.use(morgan('dev'));             // Logging
app.use(express.json());            // Parse JSON
app.use(express.urlencoded({ extended: true }));
app.use(limiter);                   // Rate limiting

// Routes
app.use('/api', routes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the MERN API' });
});

// 404 handler
app.use((req, res, next) => {
  const error = new AppError('ROUTE_NOT_FOUND', 'Route not found', 404);
  next(error);
});

// Error handling middleware
app.use(handleError);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app; 