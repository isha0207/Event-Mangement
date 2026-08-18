/**
 * Event Management System - Express Backend Server Entry Point
 * Technology: Node.js, Express.js, MongoDB / Mongoose
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Initialize MongoDB connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Route Handlers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'EventHub REST API Server',
    time: new Date().toISOString()
  });
});

// Root API Welcome route
app.get('/', (req, res) => {
  res.send('🚀 EventHub API Engine is running smoothly!');
});

// Custom 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: `API Endpoint Not Found - ${req.originalUrl}` });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[Server Error Handler]', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Event Management Server running on port ${PORT}`);
  console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================\n`);
});
