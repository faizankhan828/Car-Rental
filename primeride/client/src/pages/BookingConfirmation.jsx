import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check } from 'lucide-react';
import { getBookingById } from '../services/bookingService';
import { useCurrency } from '../context/CurrencyContext';
import { formatDate } from '../utils/helpers';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { format } = useCurrency();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookingById(bookingId)
      .then((res) => setBooking(res.data.booking))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-24"><LoadingSpinner size="lg" /></div>;
  if (!booking) return null;

  return (
    <>
      <Helmet><title>Booking Confirmed — PrimeRide</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 pt-16">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500 mb-8">WhatsApp confirmation sent to your phone.</p>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 text-left mb-8 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Booking ID</span>
              <span className="font-mono text-xs text-gray-600 dark:text-gray-300">{booking._id?.slice(-8)?.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Car</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {booking.carId?.brand} {booking.carId?.model}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pickup</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{formatDate(booking.pickupDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">{format(booking.totalPrice)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button fullWidth onClick={() => navigate('/dashboard')}>View My Bookings</Button>
            <Button fullWidth variant="outline" onClick={() => navigate('/cars')}>Browse More Cars</Button>
          </div>
        </div>
      </div>
    </>
  );
}
