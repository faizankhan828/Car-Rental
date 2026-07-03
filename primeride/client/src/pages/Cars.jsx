import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarStore } from '../store/carStore';
import { CAR_MODELS } from '../data/staticCars';
import CarCard from '../components/cars/CarCard';
import Button from '../components/ui/Button';

const BRANDS = ['All Brands', 'Suzuki', 'Honda', 'Toyota'];
const CATEGORIES = ['All Types', 'hatchback', 'sedan'];
const PRICE_RANGES = ['Any Price', 'Under 5,000', '5,000 – 7,000', 'Above 7,000'];

export default function Cars() {
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('All Brands');
  const [model, setModel] = useState('All Models');
  const [category, setCategory] = useState('All Types');
  const [price, setPrice] = useState('Any Price');
  const [withDriver, setWithDriver] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { cars } = useCarStore();

  const filtered = useMemo(() => {
    return cars.filter((car) => {
      const q = search.toLowerCase();
      if (q && !`${car.brand} ${car.model} ${car.year}`.toLowerCase().includes(q)) return false;
      if (brand !== 'All Brands' && car.brand !== brand) return false;
      if (model !== 'All Models' && `${car.brand} ${car.model}` !== model) return false;
      if (category !== 'All Types' && car.category !== category) return false;
      if (withDriver && !car.withDriverAvailable) return false;
      if (price === 'Under 5,000' && car.pricePerDay >= 5000) return false;
      if (price === '5,000 – 7,000' && (car.pricePerDay < 5000 || car.pricePerDay > 7000)) return false;
      if (price === 'Above 7,000' && car.pricePerDay <= 7000) return false;
      return true;
    });
  }, [search, brand, model, category, price, withDriver]);

  const reset = () => {
    setSearch(''); setBrand('All Brands'); setModel('All Models');
    setCategory('All Types'); setPrice('Any Price'); setWithDriver(false);
  };

  const hasFilters = search || brand !== 'All Brands' || model !== 'All Models' ||
    category !== 'All Types' || price !== 'Any Price' || withDriver;

  const selectCls = "w-full py-2.5 px-3 text-sm border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer";

  return (
    <>
      <Helmet>
        <title>Find a Car — PrimeRide Pakistan</title>
        <meta name="description" content="Browse Suzuki, Honda and Toyota cars for rent in Lahore. Self-drive or with driver." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Page header */}
        <div className="bg-white border-b border-gray-200 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Find a Car</h1>
            <p className="text-gray-500 text-sm">{filtered.length} vehicles available</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── Sidebar Filters ── */}
            <aside className="w-full lg:w-64 shrink-0">
              {/* Mobile toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowFilters(v => !v)}
                  leftIcon={<Filter size={15} />}
                  className="w-full sm:w-auto"
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                  {hasFilters && <span className="ml-1.5 w-2 h-2 bg-blue-600 rounded-full inline-block" />}
                </Button>
              </div>

              <AnimatePresence>
                {(showFilters || true) && (
                  <motion.div
                    initial={false}
                    className={`bg-white rounded-2xl border border-gray-200 p-5 space-y-5 lg:block ${!showFilters ? 'hidden lg:block' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 text-sm">Filters</h3>
                      {hasFilters && (
                        <button onClick={reset} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                          <X size={12} /> Clear all
                        </button>
                      )}
                    </div>

                    {/* Search */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Search</label>
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Brand, model..."
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Brand */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Brand</label>
                      <select value={brand} onChange={e => { setBrand(e.target.value); setModel('All Models'); }} className={selectCls}>
                        {BRANDS.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>

                    {/* Model */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Model</label>
                      <select value={model} onChange={e => setModel(e.target.value)} className={selectCls}>
                        {CAR_MODELS.filter(m => m === 'All Models' || brand === 'All Brands' || m.startsWith(brand)).map(m => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    {/* Type */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Vehicle Type</label>
                      <select value={category} onChange={e => setCategory(e.target.value)} className={selectCls}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c === 'hatchback' ? 'Hatchback' : c === 'sedan' ? 'Sedan' : c}</option>)}
                      </select>
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Price per Day (PKR)</label>
                      <select value={price} onChange={e => setPrice(e.target.value)} className={selectCls}>
                        {PRICE_RANGES.map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>

                    {/* Driver */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={withDriver}
                        onChange={e => setWithDriver(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700">With Driver Available</span>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>
            </aside>

            {/* ── Car Grid ── */}
            <div className="flex-1 min-w-0">
              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                  <div className="text-5xl mb-4">🚗</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No cars found</h3>
                  <p className="text-gray-500 text-sm mb-5">Try changing your filters</p>
                  <Button onClick={reset} variant="outline">Clear Filters</Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((car, i) => (
                    <CarCard key={car._id} car={car} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
