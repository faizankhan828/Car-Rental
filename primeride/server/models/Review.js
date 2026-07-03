const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
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
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// One review per booking
reviewSchema.index({ bookingId: 1 }, { unique: true });

// After a review is saved/removed, update car's average rating
reviewSchema.post('save', async function () {
  await updateCarRating(this.carId);
});

reviewSchema.post('remove', async function () {
  await updateCarRating(this.carId);
});

async function updateCarRating(carId) {
  const Review = mongoose.model('Review');
  const Car = mongoose.model('Car');

  const stats = await Review.aggregate([
    { $match: { carId: carId, isApproved: true } },
    {
      $group: {
        _id: '$carId',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Car.findByIdAndUpdate(carId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  } else {
    await Car.findByIdAndUpdate(carId, {
      averageRating: 0,
      reviewCount: 0,
    });
  }
}

module.exports = mongoose.model('Review', reviewSchema);
