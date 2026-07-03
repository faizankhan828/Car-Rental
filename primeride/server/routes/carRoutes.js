const express = require('express');
const { body } = require('express-validator');
const {
  getCars,
  getCarById,
  getCarAvailability,
  createCar,
  updateCar,
  deleteCar,
  deleteCarImage,
} = require('../controllers/carController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadCarImages } = require('../utils/cloudinary');

const router = express.Router();

const carValidation = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('brand').trim().notEmpty().withMessage('Brand is required.'),
  body('model').trim().notEmpty().withMessage('Model is required.'),
  body('year').isInt({ min: 1990, max: 2030 }).withMessage('Valid year required.'),
  body('category').isIn(['sedan', 'suv', 'crossover', 'luxury', 'van']).withMessage('Valid category required.'),
  body('transmission').isIn(['manual', 'automatic']).withMessage('Valid transmission required.'),
  body('seats').isInt({ min: 2, max: 20 }).withMessage('Valid seat count required.'),
  body('pricePerDay').isFloat({ min: 0 }).withMessage('Valid price required.'),
  body('city').trim().notEmpty().withMessage('City is required.'),
];

router.get('/', getCars);
router.get('/:id', getCarById);
router.get('/:id/availability', getCarAvailability);

router.post('/', protect, adminOnly, uploadCarImages, carValidation, createCar);
router.put('/:id', protect, adminOnly, uploadCarImages, updateCar);
router.delete('/:id/images/:publicId', protect, adminOnly, deleteCarImage);
router.delete('/:id', protect, adminOnly, deleteCar);

module.exports = router;
