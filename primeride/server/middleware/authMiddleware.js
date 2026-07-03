const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Protect routes — verifies JWT access token OR admin API key
 */
const protect = async (req, res, next) => {
  try {
    // Allow admin API key bypass
    const adminKey = req.headers['x-admin-key'];
    if (adminKey && adminKey === process.env.ADMIN_API_KEY) {
      // Attach a synthetic admin user
      req.user = { _id: 'admin', role: 'admin', username: 'Admin' };
      return next();
    }

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found. Token invalid.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired.', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ success: false, message: 'Token invalid.' });
  }
};

/**
 * Restrict to admin role only
 */
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }
  next();
};

/**
 * Optional auth — attaches user if token present, doesn't fail if not
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = verifyAccessToken(token);
      req.user = await User.findById(decoded.id).select('-password');
    }
  } catch {
    // Ignore — optional auth
  }
  next();
};

module.exports = { protect, adminOnly, optionalAuth };
