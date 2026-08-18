/**
 * Booking Model Schema
 * User ticket reservation, payment details, QR pass key, and status
 */

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    totalPrice: {
      type: Number,
      required: true
    },
    seatTier: {
      type: String,
      enum: ['Standard', 'VIP', 'Front Row'],
      default: 'Standard'
    },
    paymentStatus: {
      type: String,
      enum: ['Completed', 'Pending', 'Failed', 'Refunded'],
      default: 'Completed'
    },
    transactionId: {
      type: String,
      required: true,
      unique: true
    },
    bookingCode: {
      type: String,
      required: true,
      unique: true
    },
    bookingDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Cancelled'],
      default: 'Confirmed'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
