const axios = require('axios');

const WHATSAPP_API_URL = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

/**
 * Send a WhatsApp message via Meta Cloud API
 * @param {string} to - Phone number in international format (e.g., 923001234567)
 * @param {string} message - Text message content
 */
const sendWhatsAppMessage = async (to, message) => {
  if (!process.env.WHATSAPP_API_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    console.warn('⚠️  WhatsApp API credentials not configured — skipping notification.');
    return { success: false, reason: 'not_configured' };
  }

  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('WhatsApp API error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

/**
 * Build booking confirmation message
 */
const buildBookingConfirmationMessage = (booking, car, customer) => {
  const pickup = new Date(booking.pickupDate).toLocaleDateString('en-PK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const dropoff = new Date(booking.dropoffDate).toLocaleDateString('en-PK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    `🚗 *PrimeRide Booking Confirmed!*\n\n` +
    `Hi ${customer.username}! Your booking is confirmed.\n\n` +
    `📋 *Booking Details:*\n` +
    `• Vehicle: ${car.brand} ${car.model} (${car.year})\n` +
    `• Pickup: ${pickup}\n` +
    `• Drop-off: ${dropoff}\n` +
    `• From: ${booking.pickupLocation}\n` +
    `• To: ${booking.dropoffLocation}\n` +
    `• Driver: ${booking.withDriver ? 'Included ✓' : 'Self-Drive'}\n\n` +
    `💰 *Total: PKR ${booking.totalPrice.toLocaleString()}*\n\n` +
    `For assistance, reply to this message or call us.\n` +
    `Thank you for choosing PrimeRide! 🏁`
  );
};

module.exports = { sendWhatsAppMessage, buildBookingConfirmationMessage };
