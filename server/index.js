const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDB } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const donationRoutes = require('./routes/donationRoutes');
const organRoutes = require('./routes/organRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Medical Support & Organ Donation API Prototype Running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/organs', organRoutes);
app.use('/api/admin', adminRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
});

// Start Server
if (require.main === module) {
  initDB();
  app.listen(PORT, () => {
    console.log(`🚀 Prototype API Server running on port ${PORT}`);
  });
}

module.exports = app;
