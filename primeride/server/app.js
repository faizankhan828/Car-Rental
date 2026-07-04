require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const carRoutes = require('./routes/carRoutes');
const { seedAdminUser } = require('./utils/seedAdmin');

const app = express();

// CORS — open to all origins
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key'],
}));
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health — always responds, no DB needed
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    mongo: process.env.MONGO_URI ? 'configured' : 'MISSING',
    ts: new Date().toISOString(),
  });
});

// Cars API
app.use('/api/cars', carRoutes);

app.use(notFound);
app.use(errorHandler);

// Connect DB + seed in background — doesn't block responses
connectDB()
  .then(() => seedAdminUser())
  .catch(err => console.error('Startup error:', err.message));

module.exports = app;
