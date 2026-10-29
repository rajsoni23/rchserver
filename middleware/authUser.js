const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'rch-manager-super-secret-jwt-key-2026';

async function authUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. No bearer token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session token. Please re-authenticate.',
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User account not found.',
      });
    }

    const clientDeviceId = req.headers['x-device-id'] || req.body?.deviceId;
    if (clientDeviceId && user.deviceId && user.deviceId !== clientDeviceId) {
      return res.status(403).json({
        success: false,
        code: 'DEVICE_MISMATCH',
        error: 'This account is active on another device. Please reset device in admin or reactivate.',
      });
    }

    // Check expiry
    const isExpired = user.expiryDate ? new Date() > new Date(user.expiryDate) : true;
    const isActive = user.status === 'Active' && !isExpired;

    req.user = user;
    req.userIsActive = isActive;
    req.userIsExpired = isExpired;
    next();
  } catch (err) {
    console.error('authUser error:', err);
    return res.status(500).json({ success: false, error: 'Internal auth check error' });
  }
}

module.exports = authUser;
