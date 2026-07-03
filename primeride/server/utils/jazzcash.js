/**
 * JazzCash / EasyPaisa Integration Module
 *
 * This is a stub/mock implementation for MVP demo purposes.
 * Replace the internals with real merchant API calls once you have
 * JazzCash Merchant credentials from https://sandbox.jazzcash.com.pk
 *
 * Real flow:
 * 1. Customer selects JazzCash / EasyPaisa at checkout
 * 2. Backend generates a signed payment request and redirects customer
 * 3. JazzCash processes payment and sends callback to /api/payments/jazzcash/callback
 * 4. Backend verifies hash signature, updates booking paymentStatus → 'paid'
 */

const crypto = require('crypto');

/**
 * Initiate a JazzCash payment (STUB)
 * @param {Object} params
 * @param {number} params.amount - Amount in PKR
 * @param {string} params.bookingId - Reference booking ID
 * @param {string} params.customerPhone - Customer MSISDN (03XXXXXXXXX)
 * @param {string} params.description - Payment description
 * @returns {Object} Mock payment initiation response
 */
const initiateJazzCashPayment = async ({ amount, bookingId, customerPhone, description }) => {
  console.log(`[JazzCash STUB] Initiating payment of PKR ${amount} for booking ${bookingId}`);

  // In production, you would:
  // 1. Build the POST params required by JazzCash API
  // 2. Generate HMAC-SHA256 hash using your merchant credentials
  // 3. POST to JazzCash endpoint and return redirect URL

  const mockTransactionId = `JC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // Simulated delay to mimic API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    stub: true,
    transactionId: mockTransactionId,
    redirectUrl: `/payment/jazzcash-redirect?txnId=${mockTransactionId}&bookingId=${bookingId}`,
    message: 'JazzCash payment initiated (SANDBOX MODE)',
    amount,
    currency: 'PKR',
  };
};

/**
 * Initiate an EasyPaisa payment (STUB)
 */
const initiateEasyPaisaPayment = async ({ amount, bookingId, customerPhone, description }) => {
  console.log(`[EasyPaisa STUB] Initiating payment of PKR ${amount} for booking ${bookingId}`);

  const mockTransactionId = `EP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    stub: true,
    transactionId: mockTransactionId,
    redirectUrl: `/payment/easypaisa-redirect?txnId=${mockTransactionId}&bookingId=${bookingId}`,
    message: 'EasyPaisa payment initiated (SANDBOX MODE)',
    amount,
    currency: 'PKR',
  };
};

/**
 * Verify JazzCash callback (STUB)
 * In production: verify the pp_SecureHash from JazzCash callback
 */
const verifyJazzCashCallback = (callbackData) => {
  // Real: compute HMAC-SHA256 hash and compare with pp_SecureHash
  // For stub, always return success
  return {
    verified: true,
    transactionId: callbackData.pp_TxnRefNo || callbackData.transactionId,
    status: 'PAID',
  };
};

module.exports = {
  initiateJazzCashPayment,
  initiateEasyPaisaPayment,
  verifyJazzCashCallback,
};
