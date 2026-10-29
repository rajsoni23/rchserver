const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PortalConfig = require('../models/PortalConfig');
const Payment = require('../models/Payment');
const SystemSetting = require('../models/SystemSetting');
const Admin = require('../models/Admin');
const authAdmin = require('../middleware/authAdmin');
const defaultSelectors = require('../config/defaultSelectors');

const JWT_SECRET = process.env.JWT_SECRET || 'shree-rch-super-secret-jwt-key-2026';

/**
 * 1. Admin Login
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    const cleanUsername = username.toLowerCase().trim();

    // Check env vars first
    const envUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase().trim();
    const envPass = process.env.ADMIN_PASSWORD || 'shreeAdmin2026';

    let isMatch = false;

    if (cleanUsername === envUser && password === envPass) {
      isMatch = true;
    } else {
      // Check MongoDB Admin collection
      const adminDoc = await Admin.findOne({ username: cleanUsername });
      if (adminDoc) {
        isMatch = await bcrypt.compare(password, adminDoc.password);
      }
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { isAdmin: true, username: cleanUsername },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      username: cleanUsername,
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 2. Get Dashboard Stats
 */
router.get('/stats', authAdmin, async (req, res) => {
  try {
    const now = new Date();
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'Active', expiryDate: { $gt: now } });
    const expiredUsers = await User.countDocuments({ expiryDate: { $lte: now } });
    const pendingPayments = await Payment.countDocuments({ status: 'Pending' });

    return res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        expiredUsers,
        pendingPayments,
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 3. List Users with Search
 */
router.get('/users', authAdmin, async (req, res) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { rchId: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { deviceId: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.json({
      success: true,
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 4. Update User (Status, Expiry, Reset Device, etc.)
 */
router.put('/users/:id', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, expiryDate, rchId, mobile, resetDevice, addDays } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (status) user.status = status;
    if (rchId !== undefined) user.rchId = rchId;
    if (mobile !== undefined) user.mobile = mobile;

    if (resetDevice) {
      user.deviceId = '';
    }

    if (addDays) {
      const baseDate = (user.expiryDate && new Date(user.expiryDate) > new Date())
        ? new Date(user.expiryDate)
        : new Date();
      baseDate.setDate(baseDate.getDate() + parseInt(addDays));
      user.expiryDate = baseDate;
    } else if (expiryDate) {
      user.expiryDate = new Date(expiryDate);
    }

    await user.save();
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 5. Delete User
 */
router.delete('/users/:id', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    return res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 6. Get Payments
 */
router.get('/payments', authAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const payments = await Payment.find(query).sort({ createdAt: -1 }).limit(100);

    return res.json({ success: true, payments });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 7. Approve Payment -> Auto activate & extend 30 days
 */
router.put('/payments/:id/approve', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    payment.status = 'Approved';
    payment.reviewedAt = new Date();
    await payment.save();

    // Extend user license
    const user = await User.findOne({ email: payment.email.toLowerCase().trim() });
    if (user) {
      user.status = 'Active';
      const days = payment.planDurationDays || 30;
      const base = (user.expiryDate && new Date(user.expiryDate) > new Date())
        ? new Date(user.expiryDate)
        : new Date();
      base.setDate(base.getDate() + days);
      user.expiryDate = base;
      if (payment.rchId && !user.rchId) user.rchId = payment.rchId;
      if (payment.mobile && !user.mobile) user.mobile = payment.mobile;
      await user.save();
    }

    return res.json({ success: true, message: 'Payment approved and user license extended 30 days!' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 8. Reject Payment
 */
router.put('/payments/:id/reject', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    payment.status = 'Rejected';
    payment.reviewedAt = new Date();
    await payment.save();

    return res.json({ success: true, message: 'Payment marked as rejected' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 9. Get Dynamic Portal Selectors
 */
router.get('/selectors', authAdmin, async (req, res) => {
  try {
    const configs = await PortalConfig.find({});
    const tree = {};
    const titles = {};

    configs.forEach((cfg) => {
      tree[cfg.moduleName] = Object.fromEntries(cfg.selectors || new Map());
      titles[cfg.moduleName] = cfg.title || cfg.moduleName;
    });

    return res.json({ success: true, selectors: tree, titles });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 10. Update Dynamic Portal Selectors (Instant OTA push to all extensions!)
 */
router.put('/selectors', authAdmin, async (req, res) => {
  try {
    const { moduleName, selectors } = req.body;
    if (!moduleName || !selectors) {
      return res.status(400).json({ success: false, error: 'moduleName and selectors map are required' });
    }

    let config = await PortalConfig.findOne({ moduleName });
    if (!config) {
      config = new PortalConfig({ moduleName, selectors, version: 1 });
    } else {
      config.selectors = selectors;
      config.version += 1;
    }

    await config.save();
    return res.json({
      success: true,
      message: `Selectors for '${moduleName}' successfully updated in MongoDB. All active extension clients will receive them immediately!`,
      version: config.version,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 11. Reset Selectors to Factory Defaults
 */
router.post('/selectors/reset-defaults', authAdmin, async (req, res) => {
  try {
    for (const [moduleName, map] of Object.entries(defaultSelectors)) {
      await PortalConfig.findOneAndUpdate(
        { moduleName },
        { moduleName, selectors: map, $inc: { version: 1 } },
        { upsert: true }
      );
    }
    return res.json({ success: true, message: 'All selectors reset to initial factory defaults.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 12. Get System Settings
 */
router.get('/settings', authAdmin, async (req, res) => {
  try {
    const setting = await SystemSetting.findOne({ key: 'default_settings' }) || {
      price: 499,
      upiId: 'rch.manager@upi',
      qrCodeUrl: '',
      announcement: 'Welcome to RCH Manager!',
      minExtensionVersion: '0.0.1',
      maintenanceMode: false
    };

    return res.json({ success: true, setting });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 13. Update System Settings
 */
router.put('/settings', authAdmin, async (req, res) => {
  try {
    const { price, upiId, qrCodeUrl, announcement, minExtensionVersion, maintenanceMode } = req.body;
    let setting = await SystemSetting.findOne({ key: 'default_settings' });

    if (!setting) {
      setting = new SystemSetting({ key: 'default_settings' });
    }

    if (price !== undefined) setting.price = Number(price);
    if (upiId !== undefined) setting.upiId = upiId;
    if (qrCodeUrl !== undefined) setting.qrCodeUrl = qrCodeUrl;
    if (announcement !== undefined) setting.announcement = announcement;
    if (minExtensionVersion !== undefined) setting.minExtensionVersion = minExtensionVersion;
    if (maintenanceMode !== undefined) setting.maintenanceMode = Boolean(maintenanceMode);

    await setting.save();
    return res.json({ success: true, message: 'System settings saved successfully!', setting });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
