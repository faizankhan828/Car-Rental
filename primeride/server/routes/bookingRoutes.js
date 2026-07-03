const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

const bookingValidation = [
  body('carId').notEmpty().withMessage('Car ID required.'),
  body('pickupDate').isISO8601().withMessage('Valid pickup date required.'),
  body('dropoffDate').isISO8601().withMessage('Valid drop-off date required.'),
  body('pickupLocation').trim().notEmpty().withMessage('Pickup location required.'),
  body('dropoffLocation').trim().notEmpty().withMessage('Drop-off location required.'),
];

router.post('/', protect, bookingValidation, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/', protect, adminOnly, getAllBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/status', protect, adminOnly, updateBookingStatus);
router.post('/:id/cancel', protect, cancelBooking);

module.exports = router;
