const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  deviceId: {
    type: String,
    default: '',
    trim: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Blocked'],
    default: 'Inactive',
  },
  rchId: {
    type: String,
    default: '',
    trim: true,
  },
  mobile: {
    type: String,
    default: '',
    trim: true,
  },
  expiryDate: {
    type: Date,
    default: () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Default 2-day trial if new
  },
  plan: {
    type: String,
    default: 'Monthly',
  },
  version: {
    type: String,
    default: '0.0.1',
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
