require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const carRoutes = require('./routes/carRoutes');
const { seedAdminUser } = require('./utils/seedAdmin');

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key'],
}));
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health — instant, no DB
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', mongo: process.env.MONGO_URI ? 'configured' : 'MISSING', ts: new Date().toISOString() });
});

// DB connect middleware — runs before any /api/cars request
let dbReady = false;
app.use('/api/cars', async (req, res, next) => {
  if (!dbReady) {
    try {
      await connectDB();
      await seedAdminUser();
      dbReady = true;
    } catch (err) {
      return res.status(503).json({ success: false, message: 'DB unavailable: ' + err.message });
    }
  }
  next();
});

app.use('/api/cars', carRoutes);

app.use(notFound);
app.use(errorHandler);

// A promise consumers can await before handling requests.
// Used by server.js (local) and api/index.js (serverless) which both
// destructure { app, ready } from this module.
const ready = (async () => {
  try {
    await connectDB();
    await seedAdminUser();
    dbReady = true;
  } catch (err) {
    // Don't crash the process/function — /api/cars middleware will retry
    console.error('Startup DB connection failed:', err.message);
  }
})();

module.exports = { app, ready };
