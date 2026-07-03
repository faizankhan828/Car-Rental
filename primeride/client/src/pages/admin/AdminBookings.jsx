import { Helmet } from 'react-helmet-async';
import { MessageCircle, Phone, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { useCarStore } from '../../store/carStore';

const WA_NUMBER = '923104330007';

export default function AdminBookings() {
  const { cars } = useCarStore();

  return (
    <AdminLayout>
      <Helmet><title>Bookings — PrimeRide Admin</title></Helmet>

      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="text-gray-400 text-sm mt-1">
            Booking requests are sent directly to your WhatsApp. Review and confirm them there.
          </p>
        </div>

        {/* How it works */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">How Bookings Work</h2>
          <div className="space-y-4">
            {[
              { step: '1', text: 'Customer visits the site and browses cars', icon: Car },
              { step: '2', text: 'Customer clicks a car, fills in their name, phone, dates and location', icon: Phone },
              { step: '3', text: 'The booking form sends a pre-filled message directly to your WhatsApp', icon: MessageCircle },
              { step: '4', text: 'You review the message and confirm the booking manually via WhatsApp', icon: MessageCircle },
            ].map(({ step, text, icon: Icon }) => (
              <div key={step} className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0 mt-0.5">
                  {step}
                </div>
                <div className="flex items-center gap-3">
                  <Icon size={15} className="text-gray-500 shrink-0" />
                  <p className="text-sm text-gray-300">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open WhatsApp */}
        <div className="bg-green-900/20 border border-green-700/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/25 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="#25D366" className="w-6 h-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">Open WhatsApp to See Bookings</h3>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                All booking requests are sent to <strong className="text-gray-200">+92 310 4330007</strong>.
                Open WhatsApp to review, confirm or decline each request.
              </p>
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[#25D366] hover:bg-[#22C35C] text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
              >
                Open WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Quick fleet overview */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Active Fleet ({cars.length} cars)</h2>
            <Link to="/admin/fleet" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Manage Cars →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {cars.map(car => (
              <div key={car._id} className="flex items-center gap-2.5 p-3 bg-gray-700/50 rounded-xl">
                <img
                  src={car.images?.[0]?.url}
                  alt={car.brand}
                  className="w-10 h-7 rounded-lg object-cover bg-gray-600 shrink-0"
                  onError={e => e.target.style.display = 'none'}
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-200 truncate">{car.brand} {car.model}</p>
                  <p className="text-[10px] text-gray-500">PKR {Number(car.pricePerDay).toLocaleString()}/day</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
