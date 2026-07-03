const User = require('../models/User');

const ADMIN_EMAIL = 'admin@primeride.pk';
const ADMIN_PASSWORD = 'PrimeRide2024!';

const seedAdminUser = async () => {
  const email = ADMIN_EMAIL.toLowerCase();
  const existing = await User.findOne({ email });

  if (!existing) {
    await User.create({
      username: 'Admin',
      email,
      password: ADMIN_PASSWORD,
      role: 'admin',
      isVerified: true,
    });
    return;
  }

  if (existing.role !== 'admin') {
    existing.role = 'admin';
    await existing.save({ validateBeforeSave: false });
  }
};

module.exports = { seedAdminUser, ADMIN_EMAIL, ADMIN_PASSWORD };