const mongoose = require('mongoose');

const SystemSettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'default_settings',
  },
  price: {
    type: Number,
    default: 499,
  },
  upiId: {
    type: String,
    default: 'shree.rch@upi',
  },
  qrCodeUrl: {
    type: String,
    default: '',
  },
  announcement: {
    type: String,
    default: 'Welcome to Shree RCH! System operational and updated.',
  },
  minExtensionVersion: {
    type: String,
    default: '0.0.1',
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.models.SystemSetting || mongoose.model('SystemSetting', SystemSettingSchema);
