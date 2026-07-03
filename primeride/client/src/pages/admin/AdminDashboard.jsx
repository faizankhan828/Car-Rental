import { Helmet } from 'react-helmet-async';
import { Car, Star, MapPin, Phone, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { useCarStore } from '../../store/carStore';
import { STATIC_CARS } from '../../data/staticCars';

function StatCard({ label, value, icon: Icon, color, sub }) {
  const colors = {
    blue:   'bg-blue-600/15 text-blue-400 border-blue-500/20',
    green:  'bg-green-600/15 text-green-400 border-green-500/20',
    amber:  'bg-amber-600/15 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-600/15 text-purple-400 border-purple-500/20',
  };
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { cars, resetToDefaults } = useCarStore();

  const byBrand = cars.reduce((acc, c) => {
    acc[c.brand] = (acc[c.brand] || 0) + 1;
    return acc;
  }, {});

  const avgPrice = cars.length
    ? Math.round(cars.reduce((s, c) => s + c.pricePerDay, 0) / cars.length)
    : 0;

  const withDriver = cars.filter(c => c.withDriverAvailable).length;
  const cities = [...new Set(cars.map(c => c.city))];

  return (
    <AdminLayout>
      <Helmet><title>Dashboard — PrimeRide Admin</title></Helmet>

      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-gray-400 text-sm">Overview of your PrimeRide fleet and settings</p>
          </div>
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 text-gray-400 hover:text-gray-100 hover:border-gray-500 text-sm transition-colors"
            title="Reset cars to default data"
          >
            <RefreshCw size={14} /> Reset to Defaults
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Cars" value={cars.length} icon={Car} color="blue" sub={`${STATIC_CARS.length} default cars`} />
          <StatCard label="With Driver" value={withDriver} icon={Star} color="green" sub="driver-available" />
          <StatCard label="Avg Price" value={`PKR ${avgPrice.toLocaleString()}`} icon={Phone} color="amber" sub="per day" />
          <StatCard label="Cities" value={cities.length} icon={MapPin} color="purple" sub={cities.slice(0, 2).join(', ')} />
        </div>

        {/* By brand */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-5">Cars by Brand</h2>
            <div className="space-y-3">
              {Object.entries(byBrand).map(([brand, count]) => (
                <div key={brand} className="flex items-center gap-3">
                  <div className="w-24 text-sm text-gray-300 font-medium">{brand}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${(count / cars.length) * 100}%` }}
                    />
                  </div>
                  <div className="w-8 text-right text-sm text-gray-400">{count}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-5">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/admin/fleet"
                className="flex items-center justify-between p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl hover:bg-blue-600/20 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Car size={16} className="text-blue-400" />
                  <span className="text-sm font-medium text-gray-200">Add or edit cars</span>
                </div>
                <span className="text-xs text-gray-500 group-hover:text-gray-300">→</span>
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-green-600/10 border border-green-500/20 rounded-xl hover:bg-green-600/20 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-green-400" />
                  <span className="text-sm font-medium text-gray-200">Preview public site</span>
                </div>
                <span className="text-xs text-gray-500 group-hover:text-gray-300">↗</span>
              </a>
              <a
                href="https://wa.me/923104330007"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-amber-600/10 border border-amber-500/20 rounded-xl hover:bg-amber-600/20 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-amber-400" />
                  <span className="text-sm font-medium text-gray-200">Open WhatsApp chat</span>
                </div>
                <span className="text-xs text-gray-500 group-hover:text-gray-300">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Car list preview */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <h2 className="font-semibold text-white">Current Fleet ({cars.length} cars)</h2>
            <Link to="/admin/fleet" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Manage →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-900/50">
                  {['Car', 'Price/Day', 'City', 'Driver', 'Category'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {cars.map(car => (
                  <tr key={car._id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={car.images?.[0]?.url}
                          alt={car.brand}
                          className="w-12 h-8 rounded-lg object-cover bg-gray-700"
                        />
                        <span className="font-medium text-gray-100">{car.brand} {car.model} ({car.year})</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-300 font-medium">PKR {car.pricePerDay?.toLocaleString()}</td>
                    <td className="px-5 py-3 text-gray-400">{car.city}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        car.withDriverAvailable
                          ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {car.withDriverAvailable ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 capitalize">{car.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
