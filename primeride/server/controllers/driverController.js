const { validationResult } = require('express-validator');
const Driver = require('../models/Driver');
const { deleteImage } = require('../utils/cloudinary');

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Public
const getDrivers = async (req, res, next) => {
  try {
    const { city, available } = req.query;
    const filter = { isActive: true };
    if (city) filter.city = { $regex: city, $options: 'i' };

    const drivers = await Driver.find(filter).select('-bookedDates');
    res.json({ success: true, drivers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single driver
// @route   GET /api/drivers/:id
// @access  Public
const getDriverById = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found.' });
    }
    res.json({ success: true, driver });
  } catch (error) {
    next(error);
  }
};

// @desc    Create driver (admin)
// @route   POST /api/drivers
// @access  Admin
const createDriver = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const driverData = { ...req.body };

    if (req.file) {
      driverData.photoUrl = req.file.path;
      driverData.photoPublicId = req.file.filename;
    }

    if (typeof driverData.languages === 'string') {
      try {
        driverData.languages = JSON.parse(driverData.languages);
      } catch {
        driverData.languages = driverData.languages.split(',').map((l) => l.trim());
      }
    }

    const driver = await Driver.create(driverData);
    res.status(201).json({ success: true, driver });
  } catch (error) {
    next(error);
  }
};

// @desc    Update driver (admin)
// @route   PUT /api/drivers/:id
// @access  Admin
const updateDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found.' });
    }

    const updates = { ...req.body };

    if (req.file) {
      // Delete old photo from Cloudinary
      if (driver.photoPublicId) await deleteImage(driver.photoPublicId);
      updates.photoUrl = req.file.path;
      updates.photoPublicId = req.file.filename;
    }

    if (typeof updates.languages === 'string') {
      try {
        updates.languages = JSON.parse(updates.languages);
      } catch {
        updates.languages = updates.languages.split(',').map((l) => l.trim());
      }
    }

    const updatedDriver = await Driver.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, driver: updatedDriver });
  } catch (error) {
    next(error);
  }
};

// @desc    Get driver availability
// @route   GET /api/drivers/:id/availability
// @access  Public
const getDriverAvailability = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id).select('bookedDates');
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found.' });
    }
    res.json({ success: true, bookedDates: driver.bookedDates });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDrivers, getDriverById, createDriver, updateDriver, getDriverAvailability };
