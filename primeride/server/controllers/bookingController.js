const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Driver = require('../models/Driver');
const { sendWhatsAppMessage, buildBookingConfirmationMessage } = require('../utils/whatsapp');

const DRIVER_FEE_PER_DAY = 2000; // PKR
const SERVICE_FEE_PERCENT = 0.05; // 5%

/**
 * Check if a date range overlaps with existing bookings for a car
 */
const checkCarAvailability = async (carId, pickupDate, dropoffDate, excludeBookingId = null) => {
  const filter = {
    carId,
    bookingStatus: { $in: ['pending', 'confirmed', 'active'] },
    $or: [
      { pickupDate: { $lte: dropoffDate }, dropoffDate: { $gte: pickupDate } },
    ],
  };
  if (excludeBookingId) filter._id = { $ne: excludeBookingId };

  const overlap = await Booking.findOne(filter);
  return !overlap; // true = available
};

/**
 * Check driver availability
 */
const checkDriverAvailability = async (driverId, pickupDate, dropoffDate) => {
  const driver = await Driver.findById(driverId);
  if (!driver || !driver.isActive) return false;

  const hasConflict = driver.bookedDates.some(
    (range) =>
      new Date(range.startDate) <= new Date(dropoffDate) &&
      new Date(range.endDate) >= new Date(pickupDate)
  );

  return !hasConflict;
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Protected
const createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      carId,
      driverId,
      pickupDate,
      dropoffDate,
      pickupLocation,
      dropoffLocation,
      withDriver,
      notes,
      paymentMethod,
    } = req.body;

    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);

    if (pickup >= dropoff) {
      return res.status(400).json({ success: false, message: 'Drop-off date must be after pickup date.' });
    }

    if (pickup < new Date()) {
      return res.status(400).json({ success: false, message: 'Pickup date cannot be in the past.' });
    }

    // Verify car exists and is available
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }
    if (car.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Car is not available for booking.' });
    }

    // Server-side overlap validation
    const isCarAvailable = await checkCarAvailability(carId, pickup, dropoff);
    if (!isCarAvailable) {
      return res.status(409).json({ success: false, message: 'Car is already booked for selected dates.' });
    }

    // Validate driver if requested
    let resolvedDriverId = null;
    if (withDriver) {
      if (!car.withDriverAvailable) {
        return res.status(400).json({ success: false, message: 'This car does not support driver option.' });
      }
      if (!driverId) {
        return res.status(400).json({ success: false, message: 'Please select a driver.' });
      }
      const isDriverAvailable = await checkDriverAvailability(driverId, pickup, dropoff);
      if (!isDriverAvailable) {
        return res.status(409).json({ success: false, message: 'Selected driver is not available for these dates.' });
      }
      resolvedDriverId = driverId;
    }

    // Calculate pricing
    const days = Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24));
    const basePrice = car.pricePerDay * days;
    const driverFee = withDriver ? DRIVER_FEE_PER_DAY * days : 0;
    const serviceFee = Math.round((basePrice + driverFee) * SERVICE_FEE_PERCENT);
    const totalPrice = basePrice + driverFee + serviceFee;

    const booking = await Booking.create({
      customerId: req.user._id,
      carId,
      driverId: resolvedDriverId,
      pickupDate: pickup,
      dropoffDate: dropoff,
      pickupLocation,
      dropoffLocation,
      withDriver: Boolean(withDriver),
      basePrice,
      driverFee,
      serviceFee,
      totalPrice,
      notes,
      paymentMethod: paymentMethod || null,
      bookingStatus: 'pending',
      paymentStatus: 'unpaid',
    });

    // Add booking to driver's booked dates
    if (resolvedDriverId) {
      await Driver.findByIdAndUpdate(resolvedDriverId, {
        $push: {
          bookedDates: {
            startDate: pickup,
            endDate: dropoff,
            bookingId: booking._id,
          },
        },
      });
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate('carId', 'brand model year images pricePerDay')
      .populate('driverId', 'name photoUrl rating experienceYears')
      .populate('customerId', 'username email phone');

    res.status(201).json({ success: true, booking: populatedBooking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer's bookings
// @route   GET /api/bookings/my
// @access  Protected
const getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { customerId: req.user._id };
    if (status) filter.bookingStatus = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .populate('carId', 'brand model year images city')
      .populate('driverId', 'name photoUrl rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.bookingStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .populate('carId', 'brand model year images')
      .populate('driverId', 'name phone')
      .populate('customerId', 'username email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Protected (own booking or admin)
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('carId', 'brand model year images pricePerDay city')
      .populate('driverId', 'name photoUrl rating experienceYears languages phone')
      .populate('customerId', 'username email phone avatarUrl');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Check ownership or admin
    if (
      req.user.role !== 'admin' &&
      booking.customerId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (admin)
// @route   PATCH /api/bookings/:id/status
// @access  Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingStatus } = req.body;
    const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];

    if (!validStatuses.includes(bookingStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status.' });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('carId', 'brand model year')
      .populate('customerId', 'username email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    booking.bookingStatus = bookingStatus;
    await booking.save();

    // Send WhatsApp notification on confirmation
    if (bookingStatus === 'confirmed' && !booking.whatsappNotified && booking.customerId.phone) {
      const message = buildBookingConfirmationMessage(
        booking,
        booking.carId,
        booking.customerId
      );
      const phone = booking.customerId.phone.replace(/\D/g, ''); // strip non-digits
      const result = await sendWhatsAppMessage(phone, message);
      if (result.success) {
        booking.whatsappNotified = true;
        await booking.save();
      }
    }

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   POST /api/bookings/:id/cancel
// @access  Protected (customer can cancel own pending booking, admin can cancel any)
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const isOwner = booking.customerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (['completed', 'cancelled'].includes(booking.bookingStatus)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel this booking.' });
    }

    if (!isAdmin && booking.bookingStatus === 'active') {
      return res.status(400).json({ success: false, message: 'Cannot cancel an active rental.' });
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    // Remove from driver's booked dates
    if (booking.driverId) {
      await Driver.findByIdAndUpdate(booking.driverId, {
        $pull: { bookedDates: { bookingId: booking._id } },
      });
    }

    res.json({ success: true, message: 'Booking cancelled.', booking });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};
