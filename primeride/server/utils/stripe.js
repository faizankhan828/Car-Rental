const Stripe = require('stripe');

let stripe;

const getStripe = () => {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }
  return stripe;
};

/**
 * Create a Stripe Payment Intent
 */
const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  const stripeInstance = getStripe();
  const paymentIntent = await stripeInstance.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe uses smallest currency unit
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  });
  return paymentIntent;
};

/**
 * Construct Stripe webhook event
 */
const constructWebhookEvent = (payload, sig, secret) => {
  const stripeInstance = getStripe();
  return stripeInstance.webhooks.constructEvent(payload, sig, secret);
};

module.exports = { getStripe, createPaymentIntent, constructWebhookEvent };
