require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const driverRoutes = require('./routes/driverRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { seedAdminUser } = require('./utils/seedAdmin');

const app = express();

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      const allowed = [
        'http://localhost:5173',
        'http://localhost:3000',
        // Your deployed Vercel frontend
        'https://rentacar-ruddy.vercel.app',
        // Allow any *.vercel.app preview URL
        /\.vercel\.app$/,
      ];

      const isAllowed = allowed.some((pattern) =>
        pattern instanceof RegExp ? pattern.test(origin) : pattern === origin
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        // Also allow if FRONTEND_URL env var matches
        const envUrl = process.env.FRONTEND_URL;
        if (envUrl && origin === envUrl) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: origin ${origin} not allowed`));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const ready = (async () => {
  await connectDB();
  await seedAdminUser();
})();

module.exports = { app, ready };
