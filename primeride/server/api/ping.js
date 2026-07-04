// Minimal test endpoint — no Express, no DB, no imports
// If this works but /api/health doesn't, the crash is in app.js requires
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ 
    pong: true, 
    time: new Date().toISOString(),
    env: {
      node: process.version,
      mongo: process.env.MONGO_URI ? 'set' : 'MISSING',
      jwt: process.env.JWT_SECRET ? 'set' : 'MISSING',
    }
  }));
};
