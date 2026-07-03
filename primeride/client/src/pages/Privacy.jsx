import { Helmet } from 'react-helmet-async';
export default function Privacy() {
  return (
    <>
      <Helmet><title>Privacy Policy — PrimeRide</title></Helmet>
      <div className="pt-24 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 prose dark:prose-invert">
          <h1>Privacy Policy</h1>
          <p className="text-gray-500">Last updated: January 2025</p>
          <h2>1. Information We Collect</h2>
          <p>We collect name, email, phone number, and booking details to provide our service.</p>
          <h2>2. How We Use Your Data</h2>
          <p>Your data is used to process bookings, send notifications, and improve our services. We do not sell your data.</p>
          <h2>3. WhatsApp Notifications</h2>
          <p>By providing your phone number, you consent to receive booking confirmations via WhatsApp.</p>
          <h2>4. Data Security</h2>
          <p>We use industry-standard encryption and secure storage practices to protect your information.</p>
          <h2>5. Cookies</h2>
          <p>We use cookies for authentication (httpOnly) and preferences (localStorage). No third-party tracking cookies.</p>
          <h2>6. Contact</h2>
          <p>Privacy concerns? Email us at privacy@primeride.pk</p>
        </div>
      </div>
    </>
  );
}
