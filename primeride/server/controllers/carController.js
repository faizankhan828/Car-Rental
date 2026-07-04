const Car = require('../models/Car');

// GET /api/cars
const getCars = async (req, res) => {
  try {
    const { category, city, transmission, seats, withDriver, priceMin, priceMax, search, page = 1, limit = 100, sort = '-createdAt' } = req.query;

    const filter = { status: 'available' };
    if (category)             filter.category = category;
    if (city)                 filter.city = { $regex: city, $options: 'i' };
    if (transmission)         filter.transmission = transmission;
    if (seats)                filter.seats = { $gte: parseInt(seats) };
    if (withDriver === 'true') filter.withDriverAvailable = true;
    if (priceMin || priceMax) {
      filter.pricePerDay = {};
      if (priceMin) filter.pricePerDay.$gte = parseFloat(priceMin);
      if (priceMax) filter.pricePerDay.$lte = parseFloat(priceMax);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [total, cars] = await Promise.all([
      Car.countDocuments(filter),
      Car.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
    ]);

    res.json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), cars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/cars/:id
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    res.json({ success: true, car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/cars  (admin)
const createCar = async (req, res) => {
  try {
    const data = { ...req.body };
    // title is required by schema — auto-generate if missing
    if (!data.title) data.title = `${data.brand} ${data.model}`;
    if (typeof data.features === 'string') {
      data.features = data.features.split(',').map(f => f.trim()).filter(Boolean);
    }
    const car = await Car.create(data);
    res.status(201).json({ success: true, car });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/cars/:id  (admin)
const updateCar = async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.features === 'string') {
      data.features = data.features.split(',').map(f => f.trim()).filter(Boolean);
    }
    const car = await Car.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: false });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    res.json({ success: true, car });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/cars/:id  (admin)
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    res.json({ success: true, message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar };
