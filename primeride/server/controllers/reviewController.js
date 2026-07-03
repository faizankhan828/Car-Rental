const { validationResult } = require('express-validator');
const Review = require('../models/Review');
const Booking = require('../models/Booking');

// @desc    Create review (post-rental)
// @route   POST /api/reviews
// @access  Protected
const createReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { bookingId, rating, comment } = req.body;

    // Verify booking belongs to user and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (booking.bookingStatus !== 'completed') {
      return res.status(400).json({ success: false, message: 'You can only review completed bookings.' });
    }

    // Check if review already exists for this booking
    const existing = await Review.findOne({ bookingId });
    if (existing) {
      return res.status(409).json({ success: false, message: 'You have already reviewed this booking.' });
    }

    const review = await Review.create({
      bookingId,
      customerId: req.user._id,
      carId: booking.carId,
      rating,
      comment,
    });

    const populated = await Review.findById(review._id).populate('customerId', 'username avatarUrl');

    res.status(201).json({ success: true, review: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a car
// @route   GET /api/reviews/car/:carId
// @access  Public
const getCarReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { carId: req.params.carId, isApproved: true };
    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .populate('customerId', 'username avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews (admin)
// @route   GET /api/reviews
// @access  Admin
const getAllReviews = async (req, res, next) => {
  try {
    const { isApproved, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .populate('customerId', 'username email avatarUrl')
      .populate('carId', 'brand model year')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/hide review (admin)
// @route   PATCH /api/reviews/:id/approve
// @access  Admin
const moderateReview = async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).populate('customerId', 'username').populate('carId', 'brand model');

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    res.json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review (admin)
// @route   DELETE /api/reviews/:id
// @access  Admin
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getCarReviews, getAllReviews, moderateReview, deleteReview };
