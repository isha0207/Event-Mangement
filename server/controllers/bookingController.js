/**
 * Booking Controller
 * Seat reservation, Dummy payment verification, Ticket Pass QR generation, Email receipt dispatch, and Cancellation
 */

const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { sendBookingEmail } = require('../utils/emailService');
const { memoryEvents } = require('./eventController');

// Fallback memory store for bookings
let memoryBookings = [];

// Helper to generate unique transaction and booking codes
const generateUniqueCode = (prefix) => {
  return `${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
};

// @desc    Create a new ticket booking & process dummy payment
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { eventId, quantity, seatTier, paymentDetails } = req.body;
    const userId = req.user.id || req.user._id;

    if (!eventId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid booking parameters: Event and valid quantity required' });
    }

    let targetEvent = null;
    let isDbMode = false;

    try {
      targetEvent = await Event.findById(eventId);
      if (targetEvent) isDbMode = true;
    } catch (dbErr) {
      // Memory lookup
    }

    if (!targetEvent) {
      targetEvent = memoryEvents.find((e) => e._id === eventId || e.id === eventId);
    }

    if (!targetEvent) {
      return res.status(404).json({ message: 'Target event not found' });
    }

    const availableSeats = targetEvent.totalSeats - targetEvent.bookedSeats;
    if (availableSeats < quantity) {
      return res.status(400).json({ message: `Only ${availableSeats} tickets available for this event` });
    }

    // Tier pricing modifier (VIP + 50%, Front Row + 80%)
    let tierMultiplier = 1;
    if (seatTier === 'VIP') tierMultiplier = 1.5;
    if (seatTier === 'Front Row') tierMultiplier = 1.8;

    const unitPrice = targetEvent.price * tierMultiplier;
    const totalPrice = Math.round(unitPrice * quantity);

    const transactionId = generateUniqueCode('TXN');
    const bookingCode = generateUniqueCode('PASS');

    if (isDbMode) {
      // Create DB Booking
      const booking = await Booking.create({
        user: userId,
        event: eventId,
        quantity,
        seatTier: seatTier || 'Standard',
        totalPrice,
        paymentStatus: 'Completed',
        transactionId,
        bookingCode,
        status: 'Confirmed'
      });

      // Update event booked seats count
      targetEvent.bookedSeats += Number(quantity);
      await targetEvent.save();

      // Trigger Email Notification asynchronously
      sendBookingEmail({
        toEmail: req.user.email,
        userName: req.user.name,
        eventTitle: targetEvent.title,
        quantity,
        totalPrice,
        bookingCode,
        eventDate: `${targetEvent.date} at ${targetEvent.time}`,
        location: targetEvent.location
      });

      return res.status(201).json({
        message: 'Booking confirmed & Payment processed successfully!',
        booking: {
          ...booking.toObject(),
          event: targetEvent
        }
      });
    } else {
      // Memory Mode Execution
      targetEvent.bookedSeats += Number(quantity);

      const memBooking = {
        _id: 'bk_' + Date.now(),
        user: userId,
        event: targetEvent,
        quantity: Number(quantity),
        seatTier: seatTier || 'Standard',
        totalPrice,
        paymentStatus: 'Completed',
        transactionId,
        bookingCode,
        bookingDate: new Date().toISOString(),
        status: 'Confirmed'
      };

      memoryBookings.unshift(memBooking);

      // Trigger Email Notification simulation
      sendBookingEmail({
        toEmail: req.user.email,
        userName: req.user.name,
        eventTitle: targetEvent.title,
        quantity,
        totalPrice,
        bookingCode,
        eventDate: `${targetEvent.date} at ${targetEvent.time}`,
        location: targetEvent.location
      });

      return res.status(201).json({
        message: 'Booking confirmed & Payment processed successfully!',
        booking: memBooking
      });
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error processing booking payment', error: error.message });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    try {
      const dbBookings = await Booking.find({ user: userId }).populate('event').sort({ createdAt: -1 });
      if (dbBookings.length > 0) {
        return res.json(dbBookings);
      }
    } catch (dbErr) {
      // Fallback
    }

    const userMemBookings = memoryBookings.filter(
      (b) => String(b.user) === String(userId) || String(b.user._id) === String(userId)
    );
    res.json(userMemBookings);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user bookings', error: error.message });
  }
};

// @desc    Get all system bookings (Admin)
// @route   GET /api/bookings/admin
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    try {
      const dbBookings = await Booking.find({}).populate('user', 'name email').populate('event', 'title date location').sort({ createdAt: -1 });
      if (dbBookings.length > 0) {
        return res.json(dbBookings);
      }
    } catch (dbErr) {
      // Fallback
    }

    res.json(memoryBookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin bookings', error: error.message });
  }
};

// @desc    Cancel booking & restore seat count
// @route   POST /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    try {
      const booking = await Booking.findById(id);
      if (booking) {
        if (String(booking.user) !== String(userId) && req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        if (booking.status === 'Cancelled') {
          return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        booking.status = 'Cancelled';
        booking.paymentStatus = 'Refunded';
        await booking.save();

        // Replenish seats
        const event = await Event.findById(booking.event);
        if (event) {
          event.bookedSeats = Math.max(0, event.bookedSeats - booking.quantity);
          await event.save();
        }

        return res.json({ message: 'Booking cancelled and refund processed', booking });
      }
    } catch (dbErr) {
      // Memory fallback
    }

    const memBooking = memoryBookings.find((b) => b._id === id || b.id === id);
    if (!memBooking) {
      return res.status(404).json({ message: 'Booking record not found' });
    }

    if (memBooking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    memBooking.status = 'Cancelled';
    memBooking.paymentStatus = 'Refunded';

    // Replenish event seats in memory
    const targetEvtId = memBooking.event._id || memBooking.event;
    const evt = memoryEvents.find((e) => e._id === targetEvtId || e.id === targetEvtId);
    if (evt) {
      evt.bookedSeats = Math.max(0, evt.bookedSeats - memBooking.quantity);
    }

    res.json({ message: 'Booking cancelled and refund processed', booking: memBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking,
  memoryBookings
};
