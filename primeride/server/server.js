const { app, ready } = require('./app');

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await ready;
    app.listen(PORT, () => {
      console.log(`🚀 PrimeRide API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });
  } catch (error) {
    console.error('Failed to seed admin user:', error);
    process.exit(1);
  }
};

start();
