const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const connectDB = require('../config/db');
const defaultSelectors = require('../config/defaultSelectors');
const PortalConfig = require('../models/PortalConfig');
const SystemSetting = require('../models/SystemSetting');
const Admin = require('../models/Admin');

const clientRoutes = require('../routes/clientRoutes');
const adminRoutes = require('../routes/adminRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database initialization & auto-seeding
let isInitialized = false;
async function initializeDatabase() {
  if (isInitialized) return;
  try {
    const conn = await connectDB();
    if (!conn) return;

    // 1. Seed dynamic selectors if missing
    const configCount = await PortalConfig.countDocuments();
    if (configCount === 0) {
      console.log('🌱 Seeding initial RCH portal selectors into MongoDB...');
      for (const [moduleName, map] of Object.entries(defaultSelectors)) {
        await PortalConfig.create({
          moduleName,
          title: moduleName.toUpperCase(),
          selectors: map,
          version: 1,
        });
      }
      console.log('✅ Default selectors seeded successfully.');
    }

    // 2. Seed system settings if missing
    const settingCount = await SystemSetting.countDocuments();
    if (settingCount === 0) {
      await SystemSetting.create({
        key: 'default_settings',
        price: 499,
        upiId: process.env.DEFAULT_UPI_ID || 'shree.rch@upi',
        announcement: 'Welcome to Shree RCH! System operational and updated.',
      });
      console.log('✅ Default system settings seeded.');
    }

    // 3. Seed default admin if missing
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase().trim();
      const defaultPass = process.env.ADMIN_PASSWORD || 'shreeAdmin2026';
      const hash = await bcrypt.hash(defaultPass, 10);
      await Admin.create({
        username: defaultUser,
        password: hash,
        role: 'superadmin',
      });
      console.log(`✅ Default admin created: ${defaultUser}`);
    }

    isInitialized = true;
  } catch (err) {
    console.error('Database initialization error:', err.message);
  }
}

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await initializeDatabase();
  } catch (e) {
    console.error('DB connect check error:', e.message);
  }
  next();
});

// API Routes
app.use('/api/client', clientRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Shree RCH Central Engine',
    timestamp: new Date().toISOString(),
  });
});

// Serve Admin Panel UI
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

module.exports = app;
