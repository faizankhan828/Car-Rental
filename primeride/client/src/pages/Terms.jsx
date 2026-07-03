import { Helmet } from 'react-helmet-async';
export default function Terms() {
  return (
    <>
      <Helmet><title>Terms of Service — PrimeRide</title></Helmet>
      <div className="pt-24 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 prose dark:prose-invert">
          <h1>Terms of Service</h1>
          <p className="text-gray-500">Last updated: January 2025</p>
          <h2>1. Acceptance of Terms</h2>
          <p>By using PrimeRide's platform, you agree to these Terms of Service.</p>
          <h2>2. Booking & Cancellation</h2>
          <p>Bookings can be cancelled free of charge up to 24 hours before the pickup time. Cancellations within 24 hours may incur a fee.</p>
          <h2>3. Driver Responsibility</h2>
          <p>Self-drive customers are responsible for any damages during the rental period. Comprehensive insurance is recommended.</p>
          <h2>4. Payment</h2>
          <p>All payments are processed securely via Stripe or local payment partners. Prices are displayed in PKR by default.</p>
          <h2>5. Privacy</h2>
          <p>Your data is handled in accordance with our Privacy Policy.</p>
          <h2>6. Contact</h2>
          <p>For any issues, reach us at hello@primeride.pk</p>
        </div>
      </div>
    </>
  );
}
