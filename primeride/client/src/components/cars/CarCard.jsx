import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Fuel, Gauge, MapPin, Star, User } from 'lucide-react';
import Badge from '../ui/Badge';

const FORMAT_PKR = (n) => `PKR ${n.toLocaleString()}`;

export default function CarCard({ car, index = 0 }) {
  const thumbnail = car.images?.[0]?.url || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        to={`/book/${car._id}`}
        className="group block bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
      >
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-100" style={{ paddingTop: '60%' }}>
          <img
            src={thumbnail}
            alt={`${car.brand} ${car.model}`}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            <Badge variant="primary">
              {car.category === 'hatchback' ? 'Hatchback' : car.category === 'sedan' ? 'Sedan' : car.category}
            </Badge>
            {car.withDriverAvailable && (
              <Badge variant="success">
                <User size={10} strokeWidth={2} /> Driver Available
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3 className="font-bold text-gray-900 text-[15px] leading-snug">
              {car.brand} {car.model}
            </h3>
            {car.averageRating > 0 && (
              <div className="flex items-center gap-1 shrink-0">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-gray-700">{car.averageRating}</span>
                <span className="text-xs text-gray-400">({car.reviewCount})</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
            <MapPin size={11} className="text-gray-400" />
            {car.city} · {car.year}
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 pb-4 border-b border-gray-100 mb-4">
            <span className="flex items-center gap-1.5">
              <Users size={12} className="text-gray-400" /> {car.seats} seats
            </span>
            <span className="flex items-center gap-1.5">
              <Gauge size={12} className="text-gray-400" /> {car.transmission === 'automatic' ? 'Auto' : 'Manual'}
            </span>
            <span className="flex items-center gap-1.5">
              <Fuel size={12} className="text-gray-400" /> {car.fuelType}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900">{FORMAT_PKR(car.pricePerDay)}</span>
              <span className="text-xs text-gray-400 ml-1">/ day</span>
            </div>
            <div className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl group-hover:bg-blue-700 transition-colors">
              Book Now
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
