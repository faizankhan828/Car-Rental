import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { getAllReviews, moderateReview, deleteReview } from '../../services/reviewService';
import AdminLayout from './AdminLayout';
import StarRating from '../../components/ui/StarRating';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const load = () => {
    setLoading(true);
    const params = {};
    if (filter === 'pending') params.isApproved = false;
    if (filter === 'approved') params.isApproved = true;
    getAllReviews(params)
      .then((r) => setReviews(r.data.reviews))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const handleApprove = async (id, val) => {
    try {
      await moderateReview(id, val);
      toast.success(val ? 'Review approved' : 'Review hidden');
      load();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await deleteReview(id);
      toast.success('Review deleted');
      setReviews((p) => p.filter((r) => r._id !== id));
    } catch { toast.error('Failed'); }
  };

  return (
    <AdminLayout>
      <Helmet><title>Reviews — PrimeRide Admin</title></Helmet>

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review Moderation</h1>
          <div className="flex bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
            {[{id:'pending',label:'Pending'},{id:'approved',label:'Approved'},{id:'all',label:'All'}].map(({id,label}) => (
              <button key={id} onClick={() => setFilter(id)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${filter===id?'bg-amber-500 text-white':'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No reviews found</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold shrink-0">
                      {r.customerId?.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{r.customerId?.username}</p>
                      <p className="text-xs text-gray-400">
                        {r.carId?.brand} {r.carId?.model} · {formatDate(r.createdAt)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={r.rating} size={13} />
                        {r.isApproved ? (
                          <Badge variant="success">Approved</Badge>
                        ) : (
                          <Badge variant="warning">Pending</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!r.isApproved && (
                      <button onClick={() => handleApprove(r._id, true)}
                        className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-400 hover:text-green-600 transition-colors">
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {r.isApproved && (
                      <button onClick={() => handleApprove(r._id, false)}
                        className="p-1.5 rounded-lg hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors">
                        <XCircle size={16} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(r._id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {r.comment && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-gray-800 pt-3">
                    "{r.comment}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
