const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  mobile: {
    type: String,
    default: '',
    trim: true,
  },
  rchId: {
    type: String,
    default: '',
    trim: true,
  },
  utr: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  planDurationDays: {
    type: Number,
    default: 30,
  },
  reviewedAt: {
    type: Date,
  },
  notes: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
