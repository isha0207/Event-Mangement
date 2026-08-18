/**
 * Event Model Schema
 * Complete details for scheduled events, seats, pricing, speaker, location & banner
 */

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Event description is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'General'
    },
    date: {
      type: String, // Store formatted ISO date string YYYY-MM-DD
      required: [true, 'Event date is required']
    },
    time: {
      type: String, // e.g. "18:00"
      required: [true, 'Event time is required']
    },
    location: {
      type: String,
      required: [true, 'Location or venue name is required']
    },
    city: {
      type: String,
      default: 'New York'
    },
    price: {
      type: Number,
      required: [true, 'Price per ticket is required'],
      min: 0
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats capacity is required'],
      min: 1
    },
    bookedSeats: {
      type: Number,
      default: 0
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
    },
    organizer: {
      name: { type: String, default: 'Tech Events Global' },
      email: { type: String, default: 'organizer@eventhub.com' }
    },
    speaker: {
      name: { type: String, default: 'Dr. Sarah Connor' },
      title: { type: String, default: 'Lead AI Engineer & Keynote Speaker' }
    },
    featured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Upcoming'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Virtual field to get available seats count
eventSchema.virtual('availableSeats').get(function () {
  return Math.max(0, this.totalSeats - this.bookedSeats);
});

eventSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
