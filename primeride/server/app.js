require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const cookieParser = require('cookie-parser');
const connectDB  = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes    = require('./routes/authRoutes');
const carRoutes     = require('./routes/carRoutes');
const driverRoutes  = require('./routes/driverRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes  = require('./routes/reviewRoutes');
const adminRoutes   = require('./routes/adminRoutes');
const uploadRoutes  = require('./routes/uploadRoutes');
const { seedAdminUser } = require('./utils/seedAdmin');

const app = express();

// ── CORS — allow all origins ──────────────────────────────────────────────────
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key'],
}));
app.options('*', cors()); // respond to all preflight requests immediately

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Health check (no DB needed) ───────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    environment: process.env.NODE_ENV || 'development',
    mongo: process.env.MONGO_URI ? 'configured' : 'MISSING — add MONGO_URI on Vercel',
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/cars',     carRoutes);
app.use('/api/drivers',  driverRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews',  reviewRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/uploads',  uploadRoutes);

app.use(notFound);
app.use(errorHandler);

// ── DB connect + seed (lazy, per cold start) ──────────────────────────────────
const ready = connectDB()
  .then(() => seedAdminUser())
  .catch((err) => {
    // Log but don't crash — health endpoint still works
    console.error('Startup error:', err.message);
  });

module.exports = { app, ready };
