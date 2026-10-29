const mongoose = require('mongoose');

const PortalConfigSchema = new mongoose.Schema({
  moduleName: {
    type: String,
    required: true,
    unique: true, // e.g. 'global', 'location', 'motherEntry', 'motherUpdate', 'childEntry', 'childUpdate', 'ashaSearch'
  },
  title: {
    type: String,
    default: '',
  },
  selectors: {
    type: Map,
    of: String, // key-value mapping of field name -> DOM element selector or ID
    default: {},
  },
  version: {
    type: Number,
    default: 1,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.models.PortalConfig || mongoose.model('PortalConfig', PortalConfigSchema);
