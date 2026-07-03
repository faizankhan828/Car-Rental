// Vercel serverless entry point
// Wraps the Express app as a serverless function

const serverless = require('serverless-http');
const { app, ready } = require('../app');

// Ensure DB is connected before handling requests
let handler;

module.exports = async (req, res) => {
  // Wait for DB connection + seed on cold start
  await ready;

  if (!handler) {
    handler = serverless(app);
  }

  return handler(req, res);
};
