const User = require('../models/User');
const Car  = require('../models/Car');

const ADMIN_EMAIL    = 'admin@primeride.pk';
const ADMIN_PASSWORD = 'PrimeRide2024!';

// Default cars seeded into MongoDB on first run
const DEFAULT_CARS = [
  { title:'Suzuki WagonR', brand:'Suzuki', model:'WagonR', year:2023, category:'hatchback', transmission:'manual', seats:5, fuelType:'petrol', pricePerDay:4000, city:'Lahore', withDriverAvailable:true, status:'available', description:'Fuel-efficient hatchback perfect for city commutes. Comfortable seats, good AC and economical fuel consumption.', features:['Air Conditioning','Power Steering','CNG Available','Fuel Efficient'], images:[{url:'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80',publicId:''}] },
  { title:'Suzuki Swift', brand:'Suzuki', model:'Swift', year:2023, category:'hatchback', transmission:'automatic', seats:5, fuelType:'petrol', pricePerDay:4500, city:'Lahore', withDriverAvailable:true, status:'available', description:'Sporty styling with excellent fuel economy. Automatic transmission makes city driving easy.', features:['Automatic Transmission','Air Conditioning','Power Windows','Central Locking','Alloy Wheels'], images:[{url:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',publicId:''}] },
  { title:'Suzuki Alto', brand:'Suzuki', model:'Alto', year:2023, category:'hatchback', transmission:'manual', seats:4, fuelType:'petrol', pricePerDay:3000, city:'Lahore', withDriverAvailable:true, status:'available', description:'Most affordable rental option — ideal for solo travelers or couples. Highly fuel efficient and easy to park.', features:['Air Conditioning','Power Steering','CNG Available','Budget Friendly'], images:[{url:'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=600&q=80',publicId:''}] },
  { title:'Honda City', brand:'Honda', model:'City', year:2023, category:'sedan', transmission:'automatic', seats:5, fuelType:'petrol', pricePerDay:6000, city:'Lahore', withDriverAvailable:true, status:'available', description:'Pakistan\'s most popular sedan. Perfect blend of comfort, performance and fuel efficiency.', features:['Automatic Transmission','Leather Seats','Sunroof','Rear Camera','Bluetooth'], images:[{url:'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&q=80',publicId:''}] },
  { title:'Honda Civic', brand:'Honda', model:'Civic', year:2023, category:'sedan', transmission:'automatic', seats:5, fuelType:'petrol', pricePerDay:8000, city:'Lahore', withDriverAvailable:true, status:'available', description:'Premium sport sedan with turbocharged engine, sporty design and premium interior.', features:['Turbocharged Engine','Leather Interior','Apple CarPlay','Lane Assist','Sunroof'], images:[{url:'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80',publicId:''}] },
  { title:'Toyota Corolla', brand:'Toyota', model:'Corolla', year:2023, category:'sedan', transmission:'automatic', seats:5, fuelType:'petrol', pricePerDay:7000, city:'Lahore', withDriverAvailable:true, status:'available', description:'World\'s best-selling car. Reliable, comfortable and fuel-efficient for long trips and daily commutes.', features:['Automatic Transmission','Climate Control','Rear Camera','Bluetooth','Keyless Entry'], images:[{url:'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80',publicId:''}] },
  { title:'Toyota Yaris', brand:'Toyota', model:'Yaris', year:2023, category:'sedan', transmission:'automatic', seats:5, fuelType:'petrol', pricePerDay:5500, city:'Lahore', withDriverAvailable:true, status:'available', description:'Perfect combination of style, comfort and fuel efficiency. Handles city traffic with ease.', features:['Automatic Transmission','Air Conditioning','Power Windows','Alloy Wheels','Rear Camera'], images:[{url:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80',publicId:''}] },
  { title:'Toyota Corolla GLi', brand:'Toyota', model:'Corolla GLi', year:2023, category:'sedan', transmission:'automatic', seats:5, fuelType:'petrol', pricePerDay:7500, city:'Lahore', withDriverAvailable:true, status:'available', description:'Mid-range Corolla packed with features. Smart key, leather seats and enhanced safety systems.', features:['Smart Key','Leather Seats','Climate Control','Rear Camera','Push Start','Alloy Wheels'], images:[{url:'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&q=80',publicId:''}] },
  { title:'Toyota Corolla XLi', brand:'Toyota', model:'Corolla XLi', year:2023, category:'sedan', transmission:'manual', seats:5, fuelType:'petrol', pricePerDay:6500, city:'Lahore', withDriverAvailable:true, status:'available', description:'Entry-level Corolla with Toyota\'s legendary reliability. Excellent fuel economy and low maintenance.', features:['Air Conditioning','Power Steering','Power Windows','Keyless Entry'], images:[{url:'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=600&q=80',publicId:''}] },
  { title:'Toyota Corolla Grande', brand:'Toyota', model:'Corolla Grande', year:2023, category:'sedan', transmission:'automatic', seats:5, fuelType:'petrol', pricePerDay:9000, city:'Lahore', withDriverAvailable:true, status:'available', description:'Top-of-the-line Corolla. Premium leather interior, advanced safety features and sunroof.', features:['Dual VVT-i Engine','Leather Interior','Sunroof','Lane Assist','Pre-collision System'], images:[{url:'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80',publicId:''}] },
  { title:'Toyota Corolla Altis', brand:'Toyota', model:'Corolla Altis', year:2023, category:'sedan', transmission:'automatic', seats:5, fuelType:'hybrid', pricePerDay:9500, city:'Lahore', withDriverAvailable:true, status:'available', description:'Pinnacle of the Corolla range. Hybrid powertrain with exceptional fuel efficiency and luxury features.', features:['Hybrid Engine','Premium Interior','Sunroof','JBL Sound System','Head-Up Display','Wireless Charging'], images:[{url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',publicId:''}] },
];

const seedAdminUser = async () => {
  // Seed admin user
  const email = ADMIN_EMAIL.toLowerCase();
  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({
      username: 'Admin', email,
      password: ADMIN_PASSWORD,
      role: 'admin', isVerified: true,
    });
  } else if (existing.role !== 'admin') {
    existing.role = 'admin';
    await existing.save({ validateBeforeSave: false });
  }

  // Seed default cars if none exist in DB
  const carCount = await Car.countDocuments();
  if (carCount === 0) {
    await Car.insertMany(DEFAULT_CARS);
    console.log(`✅ Seeded ${DEFAULT_CARS.length} default cars into MongoDB`);
  }
};

module.exports = { seedAdminUser, ADMIN_EMAIL, ADMIN_PASSWORD };
