import api from './api';

export const createStripeIntent = (bookingId) =>
  api.post('/payments/create-intent', { bookingId });

export const initiateJazzCash = (bookingId) =>
  api.post('/payments/jazzcash/initiate', { bookingId });

export const initiateEasyPaisa = (bookingId) =>
  api.post('/payments/easypaisa/initiate', { bookingId });

export const confirmLocalPayment = (bookingId, transactionId) =>
  api.post('/payments/local/confirm', { bookingId, transactionId });
