const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'shree-rch-super-secret-jwt-key-2026';

async function authAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.adminToken) {
      token = req.cookies.adminToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Admin authentication required.',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({
        success: false,
        error: 'Admin session expired. Please log in again.',
      });
    }

    if (!decoded.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Insufficient permissions.',
      });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    console.error('authAdmin error:', err);
    return res.status(500).json({ success: false, error: 'Internal admin auth error' });
  }
}

module.exports = authAdmin;
