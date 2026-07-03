import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Fuel, Gauge, MapPin, Star, User, ChevronLeft, ChevronRight, CheckCircle, Phone, MessageCircle, Shield } from 'lucide-react';
import { useCarStore } from '../store/carStore';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const WA_NUMBER = '923104330007';

function buildWhatsAppMessage(car, form) {
  return encodeURIComponent(
    `🚗 *Car Booking Request — PrimeRide*\n\n` +
    `*Car:* ${car.brand} ${car.model} (${car.year})\n` +
    `*Price:* PKR ${car.pricePerDay.toLocaleString()} / day\n\n` +
    `*Customer Name:* ${form.name}\n` +
    `*Phone:* ${form.phone}\n` +
    `*Passengers:* ${form.passengers}\n` +
    `*Departure Date:* ${form.pickupDate}\n` +
    `*Drop-off Date:* ${form.dropoffDate}\n` +
    `*Departure Location:* ${form.pickupLocation}\n` +
    `*Drop-off Location:* ${form.dropoffLocation}\n` +
    `*With Driver:* ${form.withDriver ? 'Yes' : 'No'}\n` +
    `*Message:* ${form.message || 'No additional message'}\n\n` +
    `Please confirm availability. Thank you!`
  );
}

export default function CarDetail() {
  const { id } = useParams();
  const { cars } = useCarStore();
  const car = cars.find(c => c._id === id);

  const [imageIndex, setImageIndex] = useState(0);
  const [form, setForm] = useState({ name: '', phone: '', passengers: 1, pickupDate: '', dropoffDate: '', pickupLocation: '', dropoffLocation: '', withDriver: false, message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Car Not Found</h2>
          <p className="text-gray-500 mb-6">This car doesn't exist or has been removed.</p>
          <Link to="/cars"><Button>Browse Cars</Button></Link>
        </div>
      </div>
    );
  }

  const images = car.images?.length > 0 ? car.images : [{ url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800' }];
  const today = new Date().toISOString().split('T')[0];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.passengers || Number(form.passengers) < 1) e.passengers = 'Passenger count is required';
    if (!form.pickupDate) e.pickupDate = 'Departure date is required';
    if (!form.dropoffDate) e.dropoffDate = 'Drop-off date is required';
    if (form.pickupDate && form.dropoffDate && form.dropoffDate <= form.pickupDate) e.dropoffDate = 'Drop-off must be after departure';
    if (!form.pickupLocation.trim()) e.pickupLocation = 'Departure location is required';
    if (!form.dropoffLocation.trim()) e.dropoffLocation = 'Drop-off location is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const msg = buildWhatsAppMessage(car, form);
    // Use location.href instead of window.open — works on all mobile browsers
    // without being blocked as a popup
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${msg}`;
    window.location.href = waUrl;
    setSubmitted(true);
    toast.success('Opening WhatsApp...');
  };

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
    setErrors(er => ({ ...er, [field]: '' }));
  };

  return (
    <>
      <Helmet>
        <title>{car.brand} {car.model} {car.year} — PrimeRide</title>
        <meta name="description" content={`Rent ${car.brand} ${car.model} in ${car.city} for PKR ${car.pricePerDay}/day.`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Back */}
          <Link to="/cars" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors group">
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to cars
          </Link>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8">

            {/* ── Left: Car Info ── */}
            <div className="space-y-6">

              {/* Image gallery */}
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                <div className="relative" style={{ paddingTop: '60%' }}>
                  <img
                    key={images[imageIndex]?.url}
                    src={images[imageIndex]?.url}
                    alt={`${car.brand} ${car.model}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setImageIndex(i => (i - 1 + images.length) % images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() => setImageIndex(i => (i + 1) % images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge variant="primary">{car.category === 'hatchback' ? 'Hatchback' : 'Sedan'}</Badge>
                  </div>
                </div>
              </div>

              {/* Car header */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                      {car.brand} {car.model}
                    </h1>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-gray-500 text-sm">{car.year}</span>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin size={13} className="text-blue-500" /> {car.city}
                      </span>
                      {car.averageRating > 0 && (
                        <span className="flex items-center gap-1 text-sm">
                          <Star size={13} className="fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-gray-800">{car.averageRating}</span>
                          <span className="text-gray-400">({car.reviewCount} reviews)</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-bold text-blue-600">PKR {car.pricePerDay.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">per day</div>
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Users, label: 'Seats', value: `${car.seats} people` },
                    { icon: Gauge, label: 'Transmission', value: car.transmission === 'automatic' ? 'Automatic' : 'Manual' },
                    { icon: Fuel, label: 'Fuel Type', value: car.fuelType },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                      <Icon size={18} className="mx-auto text-blue-500 mb-1.5" />
                      <p className="text-[11px] text-gray-400 uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">About This Car</h2>
                <p className="text-gray-600 leading-relaxed text-sm">{car.description}</p>
              </div>

              {/* Features */}
              {car.features?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-2 gap-2.5">
                    {car.features.map((f) => (
                      <div key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                        <CheckCircle size={15} className="text-green-500 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Driver available */}
              {car.withDriverAvailable && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-3">
                  <User size={20} className="text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-green-800 text-sm">Driver Available</p>
                    <p className="text-green-700 text-sm mt-0.5">A verified professional driver can be arranged for this vehicle. Add to your booking form below.</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Booking Form ── */}
            <div className="lg:sticky lg:top-20 self-start">
              <div className="mb-4 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Car Summary</p>
                <h2 className="text-lg font-bold text-gray-900">{car.brand} {car.model}</h2>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-4">{car.description}</p>
                <div className="flex items-center justify-between mt-4 text-sm">
                  <span className="text-gray-500">From</span>
                  <span className="font-semibold text-blue-600">PKR {car.pricePerDay.toLocaleString()} / day</span>
                </div>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl border border-green-200 p-8 text-center shadow-sm"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Request Sent!</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    Your booking request has been sent via WhatsApp. We'll confirm your booking within minutes.
                  </p>
                  <div className="space-y-2.5">
                    <a
                      href={`https://wa.me/${WA_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors text-sm"
                    >
                      <MessageCircle size={16} /> Open WhatsApp
                    </a>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
                    >
                      Edit Booking
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="bg-slate-950 px-6 py-5">
                    <h2 className="text-lg font-bold text-white mb-0.5">Request a Booking</h2>
                    <p className="text-slate-300 text-sm">Fill the form — we'll confirm via WhatsApp</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-slate-300 text-xs">Typically confirms in &lt; 10 minutes</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ahmed Khan"
                        value={form.name}
                        onChange={set('name')}
                        className={`w-full py-2.5 px-4 text-sm border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="+92 310 4330007"
                        value={form.phone}
                        onChange={set('phone')}
                        className={`w-full py-2.5 px-4 text-sm border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    {/* Passengers */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Passengers <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={15}
                        value={form.passengers}
                        onChange={set('passengers')}
                        className={`w-full py-2.5 px-4 text-sm border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.passengers ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                      />
                      {errors.passengers && <p className="text-xs text-red-500 mt-1">{errors.passengers}</p>}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                          Departure Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          min={today}
                          value={form.pickupDate}
                          onChange={set('pickupDate')}
                          className={`w-full py-2.5 px-3 text-sm border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.pickupDate ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                        />
                        {errors.pickupDate && <p className="text-xs text-red-500 mt-1">{errors.pickupDate}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                          Drop-off Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          min={form.pickupDate || today}
                          value={form.dropoffDate}
                          onChange={set('dropoffDate')}
                          className={`w-full py-2.5 px-3 text-sm border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.dropoffDate ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                        />
                        {errors.dropoffDate && <p className="text-xs text-red-500 mt-1">{errors.dropoffDate}</p>}
                      </div>
                    </div>

                    {/* Departure location */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Departure Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. DHA Phase 5, Lahore"
                        value={form.pickupLocation}
                        onChange={set('pickupLocation')}
                        className={`w-full py-2.5 px-4 text-sm border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.pickupLocation ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                      />
                      {errors.pickupLocation && <p className="text-xs text-red-500 mt-1">{errors.pickupLocation}</p>}
                    </div>

                    {/* Drop-off location */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Drop-off Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Gulberg, Lahore"
                        value={form.dropoffLocation}
                        onChange={set('dropoffLocation')}
                        className={`w-full py-2.5 px-4 text-sm border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.dropoffLocation ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                      />
                      {errors.dropoffLocation && <p className="text-xs text-red-500 mt-1">{errors.dropoffLocation}</p>}
                    </div>

                    {/* With driver */}
                    {car.withDriverAvailable && (
                      <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200">
                        <input
                          type="checkbox"
                          checked={form.withDriver}
                          onChange={set('withDriver')}
                          className="w-4 h-4 rounded text-blue-600 border-gray-300 cursor-pointer"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                            <User size={14} className="text-blue-500" /> Add a Driver
                          </p>
                          <p className="text-xs text-gray-500">Professional verified driver included</p>
                        </div>
                      </label>
                    )}

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Additional Info (optional)
                      </label>
                      <textarea
                        placeholder="Any special requirements or questions..."
                        rows={2}
                        value={form.message}
                        onChange={set('message')}
                        className="w-full py-2.5 px-4 text-sm border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#25D366] hover:bg-[#22C35C] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2.5 text-sm shadow-sm"
                    >
                      <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      Send Booking via WhatsApp
                    </button>

                    <div className="flex items-center justify-center gap-3 text-xs text-gray-400 pt-1">
                      <span className="flex items-center gap-1"><Shield size={11} className="text-green-500" /> Secure</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Phone size={11} className="text-blue-500" /> Fast Response</span>
                      <span>·</span>
                      <span>No hidden fees</span>
                    </div>
                  </form>
                </div>
              )}

              {/* Contact info */}
              <div className="mt-4 bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Or contact us directly</p>
                <div className="space-y-2.5">
                  <a href="tel:+923104330007" className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Phone size={14} className="text-blue-600" />
                    </div>
                    +92 310 4330007
                  </a>
                  <a href="https://wa.me/923104330007" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-700 hover:text-green-600 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                      <MessageCircle size={14} className="text-green-600" />
                    </div>
                    WhatsApp (same number)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
