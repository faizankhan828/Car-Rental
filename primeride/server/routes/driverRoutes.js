const express = require('express');
const { body } = require('express-validator');
const {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  getDriverAvailability,
} = require('../controllers/driverController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadDriverPhoto } = require('../utils/cloudinary');

const router = express.Router();

const driverValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('licenseNumber').trim().notEmpty().withMessage('License number is required.'),
  body('experienceYears').isInt({ min: 0 }).withMessage('Valid experience years required.'),
  body('phone').trim().notEmpty().withMessage('Phone is required.'),
];

router.get('/', getDrivers);
router.get('/:id', getDriverById);
router.get('/:id/availability', getDriverAvailability);

router.post('/', protect, adminOnly, uploadDriverPhoto, driverValidation, createDriver);
router.put('/:id', protect, adminOnly, uploadDriverPhoto, updateDriver);

module.exports = router;
