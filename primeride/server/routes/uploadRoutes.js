const express = require('express');
const { uploadCarImage } = require('../utils/cloudinary');

const router = express.Router();

// Open route — admin panel uploads images directly
// Security: only accepts image files, max 5MB (enforced by multer)
router.post('/car-image', (req, res, next) => {
  uploadCarImage(req, res, (err) => {
    if (err) {
      console.error('Cloudinary upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Image upload failed.',
      });
    }
    next();
  });
}, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file received.' });
  }
  res.status(201).json({
    success: true,
    image: {
      url: req.file.path,
      publicId: req.file.filename,
    },
  });
});

module.exports = router;
