const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Car images storage
const carImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'primeride/cars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'fill', quality: 'auto' }],
  },
});

// Driver photos storage
const driverPhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'primeride/drivers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', quality: 'auto' }],
  },
});

// Avatar storage
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'primeride/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 200, height: 200, crop: 'fill', quality: 'auto' }],
  },
});

const uploadCarImages = multer({
  storage: carImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).array('images', 10);

const uploadCarImage = multer({
  storage: carImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('image');

const uploadDriverPhoto = multer({
  storage: driverPhotoStorage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
}).single('photo');

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
}).single('avatar');

const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary delete error:', err);
  }
};

module.exports = {
  cloudinary,
  uploadCarImages,
  uploadCarImage,
  uploadDriverPhoto,
  uploadAvatar,
  deleteImage,
};
