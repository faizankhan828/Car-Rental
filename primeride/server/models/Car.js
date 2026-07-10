const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Car title is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    category: {
      type: String,
      enum: ['sedan', 'suv', 'crossover', 'luxury', 'van', 'hatchback'],
      required: [true, 'Category is required'],
    },
    transmission: {
      type: String,
      enum: ['manual', 'automatic'],
      required: [true, 'Transmission is required'],
    },
    seats: {
      type: Number,
      required: [true, 'Number of seats is required'],
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    withDriverAvailable: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    status: {
      type: String,
      enum: ['available', 'maintenance', 'inactive'],
      default: 'available',
    },
    description: {
      type: String,
      trim: true,
    },
    features: [String],
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'cng', 'electric', 'hybrid'],
      default: 'petrol',
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Text index for search
carSchema.index({ title: 'text', brand: 'text', model: 'text', description: 'text' });

module.exports = mongoose.model('Car', carSchema);
