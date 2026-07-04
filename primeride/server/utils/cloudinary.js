const cloudinaryV2 = require('cloudinary').v2;
const multer = require('multer');

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage — files are uploaded direct from browser to Cloudinary
// so this is only a fallback for any server-side multipart that may arrive
const memStorage = multer.memoryStorage();

const uploadCarImages  = multer({ storage: memStorage, limits: { fileSize: 5 * 1024 * 1024 } }).array('images', 10);
const uploadCarImage   = multer({ storage: memStorage, limits: { fileSize: 5 * 1024 * 1024 } }).single('image');
const uploadDriverPhoto = multer({ storage: memStorage, limits: { fileSize: 3 * 1024 * 1024 } }).single('photo');
const uploadAvatar     = multer({ storage: memStorage, limits: { fileSize: 2 * 1024 * 1024 } }).single('avatar');

const deleteImage = async (publicId) => {
  try {
    await cloudinaryV2.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary delete error:', err);
  }
};

module.exports = {
  cloudinary: cloudinaryV2,
  uploadCarImages,
  uploadCarImage,
  uploadDriverPhoto,
  uploadAvatar,
  deleteImage,
};
