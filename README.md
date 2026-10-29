# 🛡️ RCH Manager Central Cloud Server & Dynamic OTA Engine

A high-performance, secure backend server for the **RCH Manager** Chrome Extension. Built for deployment on **Vercel** with **MongoDB Atlas**.

---

## 🌟 Key Features

1. **MongoDB Atlas Migration**: Replaces Firebase with MongoDB. Full multi-tenant isolation, user tracking, and license expiry control.
2. **Dynamic OTA Selectors & Elements Engine**:
   - Stores all RCH portal DOM element IDs and CSS selectors in MongoDB.
   - When the government portal (`rch.mohfw.gov.in`) modifies any field, table, or button ID, update it in the Admin Dashboard with one click.
   - **Zero Chrome Web Store republishing needed** — all user extensions fetch the latest selectors instantly!
3. **Anti-Piracy Thin-Client Architecture**:
   - The extension code alone cannot execute automation without active authentication from this server.
   - Selectors and logic elements are delivered only to verified, active, non-expired sessions tied to the user's Device ID.
4. **Built-in Web Admin Dashboard (`/admin`)**:
   - User Management: 1-click Activate/Deactivate, Extend Expiry (+30 days, +1 year), Reset Device Lock.
   - Payment Verification: Approve UTR references with automatic 30-day license extension.
   - OTA Element Editor: Live editor for Mother Entry, Mother Update, Child Entry, Child Update, Location, and Asha modules.
   - Central Settings: Pricing, UPI ID, QR Code URL, Announcement Broadcast.
5. **Zero-Configuration Vercel Serverless Ready**:
   - Ready to push to GitHub and import to Vercel in seconds.

---

## 🚀 Quick Setup & Deployment Guide

### Step 1: Create Free MongoDB Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Create a **Free Shared Cluster (M0)**.
3. In **Database Access**, create a database user (e.g., `shreeadmin`) with a password.
4. In **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere, required for Vercel Serverless).
5. In **Database** -> **Connect** -> **Connect your application** (Drivers), copy the connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/shree_rch?retryWrites=true&w=majority
   ```

---

### Step 2: Push to GitHub
In terminal / command prompt inside this folder:
```bash
git add .
git commit -m "Initial commit of Shree RCH Cloud Server"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/rch-server.git
git push -u origin main
```

---

### Step 3: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** -> **Project**.
2. Select your newly pushed GitHub repository `rch-server`.
3. Under **Environment Variables**, add the following 4 variables:

| Variable Name | Example Value | Description |
|---|---|---|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster0...` | Your MongoDB Atlas connection URI |
| `JWT_SECRET` | `any-secure-random-secret-key-2026` | Secret key for signing user & admin tokens |
| `ADMIN_USERNAME` | `admin` | Username to log into the Admin Dashboard |
| `ADMIN_PASSWORD` | `YourSecurePassword123` | Password to log into the Admin Dashboard |

4. Click **Deploy**. Vercel will deploy your server in ~15 seconds!
5. Note your deployed Vercel URL (e.g., `https://rch-server-xyz.vercel.app`).

---

### Step 4: Access Your Admin Panel
Open:
```text
https://your-vercel-domain.vercel.app/admin
```
Log in using your `ADMIN_USERNAME` and `ADMIN_PASSWORD`.

On your very first load, the server automatically:
- Creates the admin account in MongoDB.
- Seeds all current RCH portal selectors (Mother, Child, Location, Asha, etc.) into MongoDB.
- Initializes default system settings.

---

## 📡 API Endpoints Overview

### Extension Client Endpoints (`/api/client`)
- `POST /api/client/handshake` : Authenticates extension user with email & device ID.
- `GET /api/client/status` : Checks license expiry and device status.
- `GET /api/client/selectors` : Secure OTA delivery of DOM element IDs (403 if expired).
- `POST /api/client/payment/submit` : User submits UTR number & mobile number.
- `GET /api/client/payment/info` : Returns current price, UPI ID, and QR code.

### Admin Endpoints (`/api/admin`)
- `POST /api/admin/login` : Authenticates admin and returns JWT token.
- `GET /api/admin/stats` : Returns dashboard metrics (active, expired, pending).
- `GET /api/admin/users` : Search and list all extension users.
- `PUT /api/admin/users/:id` : Update status, extend expiry, reset device lock.
- `GET /api/admin/payments` : List submitted payment receipts / UTRs.
- `PUT /api/admin/payments/:id/approve` : Approve payment and extend user +30 days.
- `GET /api/admin/selectors` : Retrieve current dynamic selectors tree.
- `PUT /api/admin/selectors` : Update portal selectors for any module with instant OTA push.
- `POST /api/admin/selectors/reset-defaults` : Reset selectors to initial factory defaults.
- `GET /api/admin/settings` : Get central pricing and announcement settings.
- `PUT /api/admin/settings` : Update central settings.
