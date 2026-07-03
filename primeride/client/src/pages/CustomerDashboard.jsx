import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Car, Calendar, Star } from 'lucide-react';
import { getMyBookings, cancelBooking } from '../services/bookingService';
import { createReview } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { formatDate, getStatusColor, getPaymentStatusColor } from '../utils/helpers';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import StarRating from '../components/ui/StarRating';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [reviewModal, setReviewModal] = useState({ open: false, booking: null });
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeTab !== 'all') params.status = activeTab;
    getMyBookings(params)
      .then((res) => setBookings(res.data.bookings))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const handleCancel = async (bookingId) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(bookingId);
      toast.success('Booking cancelled');
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, bookingStatus: 'cancelled' } : b))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const handleReviewSubmit = async () => {
    if (reviewForm.rating === 0) { toast.error('Please select a rating'); return; }
    setSubmittingReview(true);
    try {
      await createReview({
        bookingId: reviewModal.booking._id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      toast.success('Review submitted — thank you!');
      setReviewModal({ open: false, booking: null });
      setReviewForm({ rating: 0, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <>
      <Helmet><title>My Bookings — PrimeRide</title></Helmet>

      <div className="pt-16 min-h-screen bg-[#0D0D0D] dark:bg-zinc-50">

        {/* Header */}
        <div className="border-b border-[#1E1E1E] dark:border-zinc-100 bg-[#111111] dark:bg-white">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-12">
            <p className="text-[10px] tracking-[0.28em] uppercase text-[#A8B2C1] font-semibold mb-3">Dashboard</p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#EBEBEB] dark:text-zinc-900 tracking-tight">
              My Bookings
            </h1>
            <p className="text-sm text-[#666666] dark:text-zinc-500 mt-1.5">
              Welcome back, {user?.username}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-10">

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto mb-8 pb-1 -mx-1 px-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-medium rounded-full whitespace-nowrap tracking-wide transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#2A2A2A] dark:bg-zinc-200 text-[#EBEBEB] dark:text-zinc-900'
                    : 'text-[#666666] dark:text-zinc-500 hover:text-[#CCCCCC] dark:hover:text-zinc-700 hover:bg-[#1E1E1E] dark:hover:bg-zinc-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Booking list */}
          {loading ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-24">
              <Car size={36} className="mx-auto text-[#333333] dark:text-zinc-300 mb-4" strokeWidth={1} />
              <p className="text-sm text-[#666666] dark:text-zinc-500">No bookings found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking, i) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="bg-[#161616] dark:bg-white rounded-2xl border border-[#222222] dark:border-zinc-200 p-5 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Car image */}
                    <img
                      src={booking.carId?.images?.[0]?.url || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=300'}
                      alt={booking.carId?.brand}
                      className="w-full sm:w-28 h-20 rounded-xl object-cover shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-semibold text-[#EBEBEB] dark:text-zinc-900 text-sm tracking-tight">
                            {booking.carId?.brand} {booking.carId?.model}
                          </h3>
                          <p className="text-xs text-[#666666] dark:text-zinc-400 mt-0.5">
                            {booking.carId?.city} · {booking.carId?.year}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide uppercase ${getStatusColor(booking.bookingStatus)}`}>
                            {booking.bookingStatus}
                          </span>
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide uppercase ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-5 text-xs text-[#666666] dark:text-zinc-500 mb-4">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={11} strokeWidth={1.5} />
                          {formatDate(booking.pickupDate)} — {formatDate(booking.dropoffDate)}
                        </span>
                        <span className="font-semibold text-[#EBEBEB] dark:text-zinc-800">
                          {format(booking.totalPrice)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {['pending', 'confirmed'].includes(booking.bookingStatus) && (
                          <Button size="sm" variant="danger" onClick={() => handleCancel(booking._id)}>
                            Cancel
                          </Button>
                        )}
                        {booking.bookingStatus === 'completed' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            leftIcon={<Star size={12} strokeWidth={1.5} />}
                            onClick={() => setReviewModal({ open: true, booking })}
                          >
                            Leave Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review modal */}
      <Modal
        isOpen={reviewModal.open}
        onClose={() => setReviewModal({ open: false, booking: null })}
        title="Leave a Review"
      >
        <div className="space-y-5">
          <p className="text-sm text-zinc-500 dark:text-zinc-500 font-light">
            Share your experience with{' '}
            <span className="font-medium text-zinc-200 dark:text-zinc-800">
              {reviewModal.booking?.carId?.brand} {reviewModal.booking?.carId?.model}
            </span>
          </p>

          <div>
            <p className="text-xs tracking-widest uppercase text-zinc-500 dark:text-zinc-500 mb-3 font-medium">Rating</p>
            <StarRating
              value={reviewForm.rating}
              size="lg"
              onChange={(r) => setReviewForm({ ...reviewForm, rating: r })}
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-zinc-500 dark:text-zinc-500 mb-2 font-medium">
              Review (optional)
            </label>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Describe your experience..."
              rows={4}
              className="w-full px-4 py-3 text-sm rounded-2xl border border-zinc-900 dark:border-zinc-200 bg-zinc-900 dark:bg-zinc-50 text-zinc-200 dark:text-zinc-800 placeholder-zinc-700 dark:placeholder-zinc-400 resize-none focus:outline-none focus:ring-1 focus:ring-[#A8B2C1]/50 transition-all"
            />
          </div>

          <Button fullWidth onClick={handleReviewSubmit} isLoading={submittingReview}>
            Submit Review
          </Button>
        </div>
      </Modal>
    </>
  );
}
