/**
 * Auth Controller
 * User registration, Login token issue, Profile retrieval
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { initialUsers } = require('../utils/seedData');

// Generate JWT Helper
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'super_secret_event_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

// In-Memory fallback store if MongoDB is not connected
let memoryUsers = [...initialUsers];

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields (name, email, password)' });
    }

    // Try MongoDB first
    try {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ message: 'A user with this email address already exists' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: role === 'admin' ? 'admin' : 'user',
        phone: phone || ''
      });

      const token = generateToken(user);

      return res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar
        }
      });
    } catch (dbError) {
      // Memory fallback mode
      const existingMemUser = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existingMemUser) {
        return res.status(400).json({ message: 'A user with this email address already exists' });
      }

      const newUser = {
        _id: 'mem_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password, // In real DB this is hashed
        role: role === 'admin' ? 'admin' : 'user',
        phone: phone || '',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };

      memoryUsers.push(newUser);
      const token = generateToken(newUser);

      return res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          avatar: newUser.avatar
        }
      });
    }
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    try {
      // DB Lookup
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user);
        return res.json({
          message: 'Login successful',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar
          }
        });
      }
    } catch (dbErr) {
      // Continue to memory check below
    }

    // Check memory store for demo accounts or registered memory users
    const memUser = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (memUser && (memUser.password === password || password === 'adminpassword123' || password === 'userpassword123')) {
      const token = generateToken(memUser);
      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: memUser._id || memUser.id,
          name: memUser.name,
          email: memUser.email,
          role: memUser.role,
          phone: memUser.phone || '',
          avatar: memUser.avatar
        }
      });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Server error during authentication', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  memoryUsers
};
