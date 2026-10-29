const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PortalConfig = require('../models/PortalConfig');
const Payment = require('../models/Payment');
const SystemSetting = require('../models/SystemSetting');
const authUser = require('../middleware/authUser');

const JWT_SECRET = process.env.JWT_SECRET || 'shree-rch-super-secret-jwt-key-2026';

/**
 * 1. Handshake / Register / Login from Chrome Extension
 */
router.post('/handshake', async (req, res) => {
  try {
    const { email, deviceId, version, rchId, mobile } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      // Create new user record
      user = new User({
        email: cleanEmail,
        deviceId: deviceId || '',
        status: 'Inactive',
        rchId: rchId || '',
        mobile: mobile || '',
        version: version || '0.0.1',
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days trial initial
        lastLogin: new Date(),
      });
      await user.save();
    } else {
      // Update existing user
      if (!user.deviceId && deviceId) {
        user.deviceId = deviceId;
      }
      if (version) user.version = version;
      if (rchId && !user.rchId) user.rchId = rchId;
      if (mobile && !user.mobile) user.mobile = mobile;
      user.lastLogin = new Date();
      await user.save();
    }

    // Check device match
    let deviceMatch = true;
    if (deviceId && user.deviceId && user.deviceId !== deviceId) {
      deviceMatch = false;
    }

    const isExpired = user.expiryDate ? new Date() > new Date(user.expiryDate) : true;
    const isActive = user.status === 'Active' && !isExpired;

    // Issue JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, deviceId: user.deviceId },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Get system settings
    const setting = await SystemSetting.findOne({ key: 'default_settings' }) || {
      price: 499,
      upiId: 'rch.manager@upi',
      announcement: 'Welcome to RCH Manager',
      maintenanceMode: false
    };

    return res.json({
      success: true,
      token,
      deviceMatch,
      user: {
        id: user._id,
        email: user.email,
        deviceId: user.deviceId,
        status: user.status,
        expiryDate: user.expiryDate,
        rchId: user.rchId,
        mobile: user.mobile,
        isActive,
        isExpired,
      },
      system: {
        price: setting.price,
        upiId: setting.upiId,
        announcement: setting.announcement,
        maintenanceMode: setting.maintenanceMode,
      }
    });
  } catch (err) {
    console.error('Handshake error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 2. Status Check
 */
router.get('/status', authUser, async (req, res) => {
  try {
    const user = req.user;
    const isExpired = user.expiryDate ? new Date() > new Date(user.expiryDate) : true;
    const isActive = user.status === 'Active' && !isExpired;

    return res.json({
      success: true,
      isActive,
      isExpired,
      status: user.status,
      expiryDate: user.expiryDate,
      rchId: user.rchId,
      mobile: user.mobile,
      deviceId: user.deviceId,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 3. Dynamic Selectors & Elements Engine (Protected IP)
 * Returns selectors ONLY if the client is verified, active, and not expired!
 */
router.get('/selectors', authUser, async (req, res) => {
  try {
    if (!req.userIsActive) {
      return res.status(403).json({
        success: false,
        error: req.userIsExpired
          ? 'Your RCH Manager subscription has expired. Please recharge to resume automation.'
          : 'Your account is currently inactive. Please contact admin or verify payment.',
        selectors: null,
      });
    }

    // Fetch dynamic configs from database
    const configs = await PortalConfig.find({});
    const selectorTree = {};

    configs.forEach((cfg) => {
      selectorTree[cfg.moduleName] = Object.fromEntries(cfg.selectors || new Map());
    });

    return res.json({
      success: true,
      selectors: selectorTree,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error('Fetch selectors error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 4. Submit Payment / UTR Reference
 */
router.post('/payment/submit', authUser, async (req, res) => {
  try {
    const { utr, mobile, rchId, amount } = req.body;
    if (!utr) {
      return res.status(400).json({ success: false, error: 'Transaction UTR reference is required' });
    }

    const user = req.user;
    if (mobile) user.mobile = mobile;
    if (rchId) user.rchId = rchId;
    await user.save();

    const payment = new Payment({
      email: user.email,
      mobile: mobile || user.mobile,
      rchId: rchId || user.rchId,
      utr: utr.trim(),
      amount: amount || 0,
      status: 'Pending',
    });
    await payment.save();

    return res.json({
      success: true,
      message: 'Payment verification request submitted successfully. Admin will review and activate.',
    });
  } catch (err) {
    console.error('Payment submission error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 5. Payment Info (Price & UPI QR)
 */
router.get('/payment/info', async (req, res) => {
  try {
    const setting = await SystemSetting.findOne({ key: 'default_settings' }) || {
      price: 499,
      upiId: 'rch.manager@upi',
      qrCodeUrl: '',
    };

    return res.json({
      success: true,
      price: setting.price,
      upiId: setting.upiId,
      qrCodeUrl: setting.qrCodeUrl,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
