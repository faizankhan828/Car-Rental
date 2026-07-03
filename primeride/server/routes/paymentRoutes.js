const express = require('express');
const {
  createStripeIntent,
  stripeWebhook,
  initiateJazzCash,
  initiateEasyPaisa,
  confirmLocalPayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Stripe webhook must receive raw body — handled in server.js with express.raw()
router.post('/webhook', stripeWebhook);

router.post('/create-intent', protect, createStripeIntent);
router.post('/jazzcash/initiate', protect, initiateJazzCash);
router.post('/easypaisa/initiate', protect, initiateEasyPaisa);
router.post('/local/confirm', confirmLocalPayment);

module.exports = router;
