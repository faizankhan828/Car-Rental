const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Driver = require('../models/Driver');
const User = require('../models/User');
const Review = require('../models/Review');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard-stats
// @access  Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalBookings,
      activeBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
      monthRevenue,
      totalCars,
      availableCars,
      maintenanceCars,
      totalDrivers,
      totalCustomers,
      pendingReviews,
      recentBookings,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ bookingStatus: 'active' }),
      Booking.countDocuments({ bookingStatus: 'confirmed' }),
      Booking.countDocuments({ bookingStatus: 'completed' }),
      Booking.countDocuments({ bookingStatus: 'cancelled' }),
      Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Booking.aggregate([
        {
          $match: {
            paymentStatus: 'paid',
            createdAt: { $gte: startOfMonth },
          },
        },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Car.countDocuments(),
      Car.countDocuments({ status: 'available' }),
      Car.countDocuments({ status: 'maintenance' }),
      Driver.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'customer' }),
      Review.countDocuments({ isApproved: false }),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('customerId', 'username email')
        .populate('carId', 'brand model year'),
    ]);

    const bookedCars = await Booking.distinct('carId', {
      bookingStatus: { $in: ['confirmed', 'active'] },
    });

    const fleetUtilization =
      totalCars > 0 ? Math.round((bookedCars.length / totalCars) * 100) : 0;

    res.json({
      success: true,
      stats: {
        bookings: {
          total: totalBookings,
          active: activeBookings,
          confirmed: confirmedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          thisMonth: monthRevenue[0]?.total || 0,
        },
        fleet: {
          total: totalCars,
          available: availableCars,
          maintenance: maintenanceCars,
          utilization: fleetUtilization,
        },
        drivers: {
          total: totalDrivers,
        },
        customers: {
          total: totalCustomers,
        },
        reviews: {
          pending: pendingReviews,
        },
      },
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get revenue chart data (last 6 months)
// @route   GET /api/admin/revenue-chart
// @access  Admin
const getRevenueChart = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const data = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getRevenueChart };
