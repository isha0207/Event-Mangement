/**
 * Event Routes
 * Express route definitions for Events & Admin Analytics
 */

const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getAdminStats
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Public routes
router.get('/', getEvents);
router.get('/admin/stats', protect, admin, getAdminStats);
router.get('/:id', getEventById);

// Admin-only routes
router.post('/', protect, admin, createEvent);
router.put('/:id', protect, admin, updateEvent);
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;
