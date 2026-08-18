/**
 * Booking Routes
 * Express route definitions for Ticket Reservation, User Dashboard bookings, and Admin overview
 */

const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Protected User routes
router.post('/', protect, createBooking);
router.get('/my', protect, getUserBookings);
router.post('/:id/cancel', protect, cancelBooking);

// Protected Admin route
router.get('/admin', protect, admin, getAllBookings);

module.exports = router;
