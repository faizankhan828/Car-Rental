const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
    },
    pickupDate: {
      type: Date,
      required: [true, 'Pickup date is required'],
    },
    dropoffDate: {
      type: Date,
      required: [true, 'Dropoff date is required'],
    },
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required'],
      trim: true,
    },
    dropoffLocation: {
      type: String,
      required: [true, 'Drop-off location is required'],
      trim: true,
    },
    withDriver: {
      type: Boolean,
      default: false,
    },
    // Price breakdown
    basePrice: {
      type: Number,
      required: true,
    },
    driverFee: {
      type: Number,
      default: 0,
    },
    serviceFee: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    // Payment
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'jazzcash', 'easypaisa', null],
      default: null,
    },
    stripePaymentIntentId: String,
    stripeSessionId: String,
    // Booking status
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    // Notifications
    whatsappNotified: {
      type: Boolean,
      default: false,
    },
    // Customer notes
    notes: String,
  },
  { timestamps: true }
);

// Index for overlap queries
bookingSchema.index({ carId: 1, pickupDate: 1, dropoffDate: 1 });
bookingSchema.index({ customerId: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
