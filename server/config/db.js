/**
 * Database Configuration
 * Handles MongoDB connection using Mongoose with fallback capabilities
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhub_db', {
      serverSelectionTimeoutMS: 3000 // Quick timeout to fallback if mongodb service is offline
    });
    console.log(`[Database] MongoDB Connected successfully to Host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to live MongoDB (${error.message}).`);
    console.log(`[Database Fallback] App will run with built-in memory storage fallback mode for seamless demonstration!`);
    return false;
  }
};

module.exports = connectDB;
