/**
 * Event Controller
 * Handles CRUD operations for events, searching, filtering, and admin dashboard metrics
 */

const Event = require('../models/Event');
const Booking = require('../models/Booking');
const { initialEvents } = require('../utils/seedData');

// Fallback in-memory events storage
let memoryEvents = [...initialEvents];

// @desc    Get all events with optional filters & search
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { search, category, status } = req.query;

    try {
      let query = {};

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } }
        ];
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (status) {
        query.status = status;
      }

      let events = await Event.find(query).sort({ date: 1 });

      if (events.length === 0 && !search && (!category || category === 'All')) {
        // Seed default events if MongoDB collection is empty
        await Event.insertMany(initialEvents);
        events = await Event.find(query).sort({ date: 1 });
      }

      return res.json(events);
    } catch (dbErr) {
      // Memory fallback mode
      let filtered = [...memoryEvents];

      if (search) {
        const term = search.toLowerCase();
        filtered = filtered.filter(
          (e) =>
            e.title.toLowerCase().includes(term) ||
            e.description.toLowerCase().includes(term) ||
            e.location.toLowerCase().includes(term) ||
            (e.city && e.city.toLowerCase().includes(term))
        );
      }

      if (category && category !== 'All') {
        filtered = filtered.filter((e) => e.category === category);
      }

      if (status) {
        filtered = filtered.filter((e) => e.status === status);
      }

      return res.json(filtered);
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error retrieving events', error: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const event = await Event.findById(id);
      if (event) {
        return res.json(event);
      }
    } catch (dbErr) {
      // Memory lookup fallback
    }

    const event = memoryEvents.find((e) => e._id === id || e.id === id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving event details', error: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, time, location, city, price, totalSeats, image, speaker, organizer } = req.body;

    if (!title || !description || !date || !time || !location || price === undefined || !totalSeats) {
      return res.status(400).json({ message: 'Please provide all required event details' });
    }

    const newEventData = {
      title,
      description,
      category: category || 'General',
      date,
      time,
      location,
      city: city || 'New York',
      price: Number(price),
      totalSeats: Number(totalSeats),
      bookedSeats: 0,
      image: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      organizer: organizer || { name: 'Tech Events Global', email: 'organizer@eventhub.com' },
      speaker: speaker || { name: 'Keynote Speaker', title: 'Special Guest' },
      featured: req.body.featured || false,
      status: 'Upcoming',
      createdBy: req.user ? req.user.id : null
    };

    try {
      const event = await Event.create(newEventData);
      return res.status(201).json({ message: 'Event created successfully', event });
    } catch (dbErr) {
      const createdMemEvent = {
        _id: 'evt_' + Date.now(),
        ...newEventData
      };
      memoryEvents.unshift(createdMemEvent);
      return res.status(201).json({ message: 'Event created successfully (Memory Mode)', event: createdMemEvent });
    }
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
};

// @desc    Update existing event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      let event = await Event.findById(id);
      if (event) {
        Object.assign(event, req.body);
        await event.save();
        return res.json({ message: 'Event updated successfully', event });
      }
    } catch (dbErr) {
      // Memory fallback
    }

    const index = memoryEvents.findIndex((e) => e._id === id || e.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Event not found' });
    }

    memoryEvents[index] = { ...memoryEvents[index], ...req.body };
    res.json({ message: 'Event updated successfully', event: memoryEvents[index] });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const event = await Event.findByIdAndDelete(id);
      if (event) {
        return res.json({ message: 'Event deleted successfully' });
      }
    } catch (dbErr) {
      // Memory fallback
    }

    const index = memoryEvents.findIndex((e) => e._id === id || e.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Event not found' });
    }

    memoryEvents.splice(index, 1);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

// @desc    Get admin statistics (Total Revenue, Active Events, Total Bookings, Capacity fill rate)
// @route   GET /api/events/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const { memoryBookings } = require('./bookingController');
    const { memoryUsers } = require('./authController');

    let totalEvents = 0;
    let totalBookings = 0;
    let totalRevenue = 0;
    let totalUsers = 0;

    try {
      totalEvents = await Event.countDocuments({});
      totalBookings = await Booking.countDocuments({});
      
      const revenueData = await Booking.aggregate([
        { $match: { paymentStatus: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]);
      totalRevenue = revenueData[0] ? revenueData[0].total : 0;
      
      const User = require('../models/User');
      totalUsers = await User.countDocuments({});

      return res.json({
        totalEvents,
        totalBookings,
        totalRevenue,
        totalUsers
      });
    } catch (dbErr) {
      // Memory fallback calculation
      totalEvents = memoryEvents.length;
      totalBookings = memoryBookings.length;
      totalRevenue = memoryBookings
        .filter((b) => b.paymentStatus === 'Completed' && b.status !== 'Cancelled')
        .reduce((sum, b) => sum + b.totalPrice, 0);
      totalUsers = memoryUsers.length;

      return res.json({
        totalEvents,
        totalBookings,
        totalRevenue,
        totalUsers
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error computing admin statistics', error: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getAdminStats,
  memoryEvents
};
