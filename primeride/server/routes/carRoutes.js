const express = require('express');
const { getCars, getCarById, createCar, updateCar, deleteCar } = require('../controllers/carController');
const { adminKey } = require('../middleware/adminKey');

const router = express.Router();

// Public
router.get('/',    getCars);
router.get('/:id', getCarById);

// Admin only (protected by x-admin-key header)
router.post('/',    adminKey, createCar);
router.put('/:id',  adminKey, updateCar);
router.delete('/:id', adminKey, deleteCar);

module.exports = router;
