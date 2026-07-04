// Simple admin key middleware — no JWT, no DB lookup needed
const adminKey = (req, res, next) => {
  const key = req.headers['x-admin-key'];
  const expected = process.env.ADMIN_API_KEY || 'primeride-admin-2024';
  if (key === expected) return next();
  res.status(403).json({ success: false, message: 'Admin access required.' });
};

module.exports = { adminKey };
