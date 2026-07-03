const Booking = require('../models/Booking');
const { createPaymentIntent, constructWebhookEvent } = require('../utils/stripe');
const { initiateJazzCashPayment, initiateEasyPaisaPayment, verifyJazzCashCallback } = require('../utils/jazzcash');
const { sendWhatsAppMessage, buildBookingConfirmationMessage } = require('../utils/whatsapp');

// @desc    Create Stripe payment intent
// @route   POST /api/payments/create-intent
// @access  Protected
const createStripeIntent = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('carId', 'brand model year')
      .populate('customerId', 'username email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.customerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Booking already paid.' });
    }

    // Convert PKR to USD approx (for Stripe — real app would use exchange rate API)
    // For MVP: allow booking in USD directly (overseas users)
    const amountUSD = booking.totalPrice / 280; // approximate PKR/USD rate

    const paymentIntent = await createPaymentIntent(amountUSD, 'usd', {
      bookingId: booking._id.toString(),
      customerId: req.user._id.toString(),
    });

    // Store payment intent ID on booking
    booking.stripePaymentIntentId = paymentIntent.id;
    booking.paymentMethod = 'stripe';
    await booking.save();

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amountUSD,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe webhook handler
// @route   POST /api/payments/webhook
// @access  Public (Stripe sends raw body)
const stripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = constructWebhookEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const booking = await Booking.findOne({
          stripePaymentIntentId: paymentIntent.id,
        }).populate('carId customerId');

        if (booking) {
          booking.paymentStatus = 'paid';
          booking.bookingStatus = 'confirmed';
          await booking.save();

          // Send WhatsApp confirmation
          if (!booking.whatsappNotified && booking.customerId?.phone) {
            const message = buildBookingConfirmationMessage(
              booking,
              booking.carId,
              booking.customerId
            );
            const phone = booking.customerId.phone.replace(/\D/g, '');
            const result = await sendWhatsAppMessage(phone, message);
            if (result.success) {
              booking.whatsappNotified = true;
              await booking.save();
            }
          }
          console.log(`✅ Payment confirmed for booking ${booking._id}`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        await Booking.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          { paymentStatus: 'unpaid', bookingStatus: 'pending' }
        );
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        if (charge.payment_intent) {
          await Booking.findOneAndUpdate(
            { stripePaymentIntentId: charge.payment_intent },
            { paymentStatus: 'refunded', bookingStatus: 'cancelled' }
          );
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook handler error.' });
  }
};

// @desc    Initiate JazzCash payment (stub/sandbox)
// @route   POST /api/payments/jazzcash/initiate
// @access  Protected
const initiateJazzCash = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate('customerId', 'phone username');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.customerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const result = await initiateJazzCashPayment({
      amount: booking.totalPrice,
      bookingId: booking._id.toString(),
      customerPhone: booking.customerId.phone || '',
      description: `PrimeRide Booking #${booking._id}`,
    });

    booking.paymentMethod = 'jazzcash';
    await booking.save();

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// @desc    Initiate EasyPaisa payment (stub/sandbox)
// @route   POST /api/payments/easypaisa/initiate
// @access  Protected
const initiateEasyPaisa = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate('customerId', 'phone username');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.customerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const result = await initiateEasyPaisaPayment({
      amount: booking.totalPrice,
      bookingId: booking._id.toString(),
      customerPhone: booking.customerId.phone || '',
      description: `PrimeRide Booking #${booking._id}`,
    });

    booking.paymentMethod = 'easypaisa';
    await booking.save();

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// @desc    JazzCash/EasyPaisa mock callback (for demo purposes)
// @route   POST /api/payments/local/confirm
// @access  Public (called by mock redirect)
const confirmLocalPayment = async (req, res, next) => {
  try {
    const { bookingId, transactionId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('carId', 'brand model year')
      .populate('customerId', 'username email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    booking.paymentStatus = 'paid';
    booking.bookingStatus = 'confirmed';
    await booking.save();

    // WhatsApp confirmation
    if (!booking.whatsappNotified && booking.customerId?.phone) {
      const message = buildBookingConfirmationMessage(
        booking,
        booking.carId,
        booking.customerId
      );
      const phone = booking.customerId.phone.replace(/\D/g, '');
      const result = await sendWhatsAppMessage(phone, message);
      if (result.success) {
        booking.whatsappNotified = true;
        await booking.save();
      }
    }

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStripeIntent,
  stripeWebhook,
  initiateJazzCash,
  initiateEasyPaisa,
  confirmLocalPayment,
};
