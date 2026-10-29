const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ Warning: MONGODB_URI is not set. Database operations will fail until configured.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    });
    cachedConnection = conn;
    console.log('✅ Connected to MongoDB Atlas successfully.');
    return conn;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
}

module.exports = connectDB;
