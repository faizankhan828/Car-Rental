import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { calcDays, calcPricing, formatDate } from '../utils/helpers';
import { useCarStore } from '../store/carStore';
import { STATIC_CARS } from '../data/staticCars';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const STEPS = ['Review', 'Confirmation'];

export default function BookingFlow() {
  const { carId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { format } = useCurrency();
  const { getCarById } = useCarStore();

  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    pickupDate: '',
    dropoffDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    passengers: 1,
    withDriver: false,
  });

  const car = getCarById(carId) || STATIC_CARS.find((item) => item._id === carId);

  const initialTrip = {
    pickupDate: searchParams.get('pickupDate') || '',
    dropoffDate: searchParams.get('dropoffDate') || '',
    pickupLocation: searchParams.get('pickupLocation') || '',
    dropoffLocation: searchParams.get('dropoffLocation') || '',
    passengers: Number(searchParams.get('passengers') || 1),
    withDriver: searchParams.get('withDriver') === 'true',
  };

  const days = calcDays(
    bookingForm.pickupDate || initialTrip.pickupDate,
    bookingForm.dropoffDate || initialTrip.dropoffDate
  );

  useEffect(() => {
    if (!car) {
      toast.error('Failed to load booking details');
      navigate('/cars');
      return;
    }

    setBookingForm(initialTrip);
    setLoading(false);
  }, [car, carId, navigate]);

  const pricing = car && days > 0 ? calcPricing(car, days, bookingForm.withDriver) : null;

  const updateTrip = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setBookingForm((current) => ({ ...current, [field]: value }));
  };

  const handleCreateBooking = async () => {
    if (
      !bookingForm.pickupDate ||
      !bookingForm.dropoffDate ||
      !bookingForm.pickupLocation.trim() ||
      !bookingForm.dropoffLocation.trim()
    ) {
      toast.error('Please complete the booking form first');
      return;
    }

    setProcessing(true);
    try {
      const bookingMessage = encodeURIComponent(
        `🚗 *Car Booking Request — PrimeRide*\n\n` +
          `*Car:* ${car.brand} ${car.model} (${car.year})\n` +
          `*Passengers:* ${bookingForm.passengers}\n` +
          `*Departure Date:* ${bookingForm.pickupDate}\n` +
          `*Drop-off Date:* ${bookingForm.dropoffDate}\n` +
          `*Departure Location:* ${bookingForm.pickupLocation}\n` +
          `*Drop-off Location:* ${bookingForm.dropoffLocation}\n` +
          `*With Driver:* ${bookingForm.withDriver ? 'Yes' : 'No'}\n` +
          `*Estimated Total:* ${pricing ? format(pricing.totalPrice) : 'N/A'}\n\n` +
          `Please confirm availability. Thank you!`
      );

      window.open(`https://wa.me/923104330007?text=${bookingMessage}`, '_blank', 'noopener,noreferrer');

      setBooking({
        _id: `local-${Date.now()}`,
        pickupDate: bookingForm.pickupDate,
        totalPrice: pricing?.totalPrice || 0,
      });
      setStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!car) return null;

  return (
    <>
      <Helmet>
        <title>{`Book ${car.brand} ${car.model} — PrimeRide`}</title>
      </Helmet>

      <div className="pt-24 min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-center mb-10">
            {STEPS.map((label, index) => (
              <div key={label} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-all ${
                    index < step
                      ? 'bg-amber-500 text-white'
                      : index === step
                        ? 'bg-amber-500 text-white ring-4 ring-amber-200 dark:ring-amber-900'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}
                >
                  {index < step ? <Check size={16} /> : index + 1}
                </div>
                <span
                  className={`hidden sm:block ml-2 mr-6 text-sm font-medium ${
                    index === step ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
                {index < STEPS.length - 1 && (
                  <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 mr-2 sm:mr-0" />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8"
              >
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Review Your Booking</h1>

                <div className="flex gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <img
                    src={car.images?.[0]?.url || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=200'}
                    alt={car.brand}
                    className="w-24 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {car.brand} {car.model}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {car.year} • {car.transmission} • {car.fuelType}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        {format(car.pricePerDay)}/day
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        {car.seats} seats
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-500 mb-1 font-medium">Departure Date</label>
                    <input
                      type="date"
                      value={bookingForm.pickupDate}
                      onChange={updateTrip('pickupDate')}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1 font-medium">Drop-off Date</label>
                    <input
                      type="date"
                      value={bookingForm.dropoffDate}
                      onChange={updateTrip('dropoffDate')}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1 font-medium">Departure City / Location</label>
                    <input
                      type="text"
                      value={bookingForm.pickupLocation}
                      onChange={updateTrip('pickupLocation')}
                      placeholder="Enter departure city"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1 font-medium">Drop-off City / Location</label>
                    <input
                      type="text"
                      value={bookingForm.dropoffLocation}
                      onChange={updateTrip('dropoffLocation')}
                      placeholder="Enter drop-off city"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1 font-medium">Passengers</label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={bookingForm.passengers}
                      onChange={updateTrip('passengers')}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="inline-flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100 pb-2">
                      <input
                        type="checkbox"
                        checked={bookingForm.withDriver}
                        onChange={updateTrip('withDriver')}
                        className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                      />
                      Driver Needed
                    </label>
                  </div>
                </div>

                {pricing && (
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2 mb-6 text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>{format(car.pricePerDay)} × {days} days</span>
                      <span>{format(pricing.basePrice)}</span>
                    </div>
                    {bookingForm.withDriver && (
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Driver fee</span>
                        <span>{format(pricing.driverFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
                      <span>Total estimate</span>
                      <span>{format(pricing.totalPrice)}</span>
                    </div>
                  </div>
                )}

                <Button
                  fullWidth
                  size="lg"
                  onClick={handleCreateBooking}
                  isLoading={processing}
                >
                  Send Booking Request
                </Button>
              </motion.div>
            )}

            {step === 1 && booking && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 text-center"
              >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={36} className="text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Request Sent</h2>
                <p className="text-gray-500 mb-8">
                  We opened WhatsApp with your booking details. Send the message to confirm availability.
                </p>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 text-left mb-8">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Booking ID</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-xs mt-0.5">{booking._id}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Status</p>
                      <p className="font-medium text-green-600">Pending Confirmation</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Pickup</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(booking.pickupDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Total Estimate</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{format(booking.totalPrice)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="primary" fullWidth onClick={() => navigate('/dashboard')}>
                    View My Bookings
                  </Button>
                  <Button variant="outline" fullWidth onClick={() => navigate('/cars')}>
                    Book Another Car
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
