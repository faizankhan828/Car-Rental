const express = require('express');
const { body } = require('express-validator');
const {
  createReview,
  getCarReviews,
  getAllReviews,
  moderateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('bookingId').notEmpty().withMessage('Booking ID required.'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5.'),
    body('comment').optional().isLength({ max: 1000 }).withMessage('Comment too long.'),
  ],
  createReview
);

router.get('/car/:carId', getCarReviews);
router.get('/', protect, adminOnly, getAllReviews);
router.patch('/:id/approve', protect, adminOnly, moderateReview);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
