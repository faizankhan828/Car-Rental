const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  updateMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../utils/cloudinary');

const router = express.Router();

router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 2 }).withMessage('Username must be at least 2 characters.'),
    body('email').isEmail().withMessage('Valid email required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required.'),
    body('password').notEmpty().withMessage('Password required.'),
  ],
  login
);

router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);
router.post('/forgot-password', [body('email').isEmail()], forgotPassword);
router.post('/reset-password/:token', [body('password').isLength({ min: 6 })], resetPassword);

router.get('/me', protect, getMe);
router.put('/me', protect, uploadAvatar, updateMe);

module.exports = router;
