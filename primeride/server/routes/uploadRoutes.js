const express = require('express');
const { uploadCarImage } = require('../utils/cloudinary');

const router = express.Router();

router.post('/car-image', uploadCarImage, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image uploaded.' });
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