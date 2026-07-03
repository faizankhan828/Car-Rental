const { validationResult } = require('express-validator');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const { deleteImage } = require('../utils/cloudinary');

// @desc    Get all cars with filters
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res, next) => {
  try {
    const {
      category,
      city,
      priceMin,
      priceMax,
      withDriver,
      transmission,
      seats,
      search,
      page = 1,
      limit = 12,
      sort = '-createdAt',
    } = req.query;

    const filter = { status: 'available' };

    if (category) filter.category = category;
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (transmission) filter.transmission = transmission;
    if (seats) filter.seats = { $gte: parseInt(seats) };
    if (withDriver === 'true') filter.withDriverAvailable = true;
    if (priceMin || priceMax) {
      filter.pricePerDay = {};
      if (priceMin) filter.pricePerDay.$gte = parseFloat(priceMin);
      if (priceMax) filter.pricePerDay.$lte = parseFloat(priceMax);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Car.countDocuments(filter);
    const cars = await Car.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      cars,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }
    res.json({ success: true, car });
  } catch (error) {
    next(error);
  }
};

// @desc    Get car availability (booked date ranges)
// @route   GET /api/cars/:id/availability
// @access  Public
const getCarAvailability = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    const filter = {
      carId: req.params.id,
      bookingStatus: { $in: ['pending', 'confirmed', 'active'] },
    };

    // Optionally filter by month/year for calendar display
    if (month && year) {
      const start = new Date(parseInt(year), parseInt(month) - 1, 1);
      const end = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      filter.$or = [
        { pickupDate: { $lte: end }, dropoffDate: { $gte: start } },
      ];
    }

    const bookings = await Booking.find(filter).select('pickupDate dropoffDate');
    const bookedRanges = bookings.map((b) => ({
      start: b.pickupDate,
      end: b.dropoffDate,
    }));

    res.json({ success: true, bookedRanges });
  } catch (error) {
    next(error);
  }
};

// @desc    Create car (admin)
// @route   POST /api/cars
// @access  Admin
const createCar = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const carData = { ...req.body };

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      carData.images = req.files.map((f) => ({
        url: f.path,
        publicId: f.filename,
      }));
    }

    // Parse features if sent as JSON string
    if (typeof carData.features === 'string') {
      try {
        carData.features = JSON.parse(carData.features);
      } catch {
        carData.features = carData.features.split(',').map((f) => f.trim());
      }
    }

    const car = await Car.create(carData);
    res.status(201).json({ success: true, car });
  } catch (error) {
    next(error);
  }
};

// @desc    Update car (admin)
// @route   PUT /api/cars/:id
// @access  Admin
const updateCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }

    const updates = { ...req.body };

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => ({
        url: f.path,
        publicId: f.filename,
      }));
      updates.images = [...(car.images || []), ...newImages];
    }

    if (typeof updates.features === 'string') {
      try {
        updates.features = JSON.parse(updates.features);
      } catch {
        updates.features = updates.features.split(',').map((f) => f.trim());
      }
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, car: updatedCar });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete car image (admin)
// @route   DELETE /api/cars/:id/images/:publicId
// @access  Admin
const deleteCarImage = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });

    const publicId = decodeURIComponent(req.params.publicId);
    await deleteImage(publicId);

    car.images = car.images.filter((img) => img.publicId !== publicId);
    await car.save();

    res.json({ success: true, car });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete car (admin)
// @route   DELETE /api/cars/:id
// @access  Admin
const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }

    // Clean up Cloudinary images
    for (const img of car.images) {
      if (img.publicId) await deleteImage(img.publicId);
    }

    await car.deleteOne();
    res.json({ success: true, message: 'Car deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCars,
  getCarById,
  getCarAvailability,
  createCar,
  updateCar,
  deleteCar,
  deleteCarImage,
};
