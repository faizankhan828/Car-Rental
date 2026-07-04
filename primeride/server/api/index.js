const serverless = require('serverless-http');
const { app, ready } = require('../app');

let handler;

module.exports = async (req, res) => {
  // Wait for DB on cold start (max 10s), but don't fail if it errors
  try { await ready; } catch (_) {}

  if (!handler) handler = serverless(app);
  return handler(req, res);
};
