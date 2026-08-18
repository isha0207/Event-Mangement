/**
 * Auth Middleware
 * Verifies JWT token attached to request Authorization header
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_event_jwt_key_2026');

      // Attach user from database or memory mock user
      const user = await User.findById(decoded.id).select('-password');
      
      if (user) {
        req.user = user;
      } else {
        // Fallback for mocked memory sessions if DB is disconnected
        req.user = {
          _id: decoded.id,
          id: decoded.id,
          name: decoded.name || 'Demo User',
          email: decoded.email || 'user@demo.com',
          role: decoded.role || 'user'
        };
      }

      return next();
    } catch (error) {
      console.error('[Auth Middleware] Invalid token token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }
};

module.exports = { protect };
