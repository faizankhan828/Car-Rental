const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true,
    },
    photoUrl: {
      type: String,
      default: '',
    },
    photoPublicId: String,
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    experienceYears: {
      type: Number,
      required: [true, 'Experience years is required'],
      min: 0,
    },
    languages: [String],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Stores booked date ranges for availability checking
    bookedDates: [
      {
        startDate: Date,
        endDate: Date,
        bookingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Booking',
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Driver', driverSchema);
