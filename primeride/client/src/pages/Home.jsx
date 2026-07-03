import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Clock, CheckCircle2, HeadphonesIcon, ArrowRight, Star, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>PrimeRide — Car Rental Pakistan | Lahore</title>
        <meta name="description" content="Rent cars across Pakistan. Suzuki, Honda, Toyota and more. Self-drive or with driver. Book now." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center bg-gray-950 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1920&q=85"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-gray-950/20" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              <MapPin size={12} /> Pakistan's #1 Car Rental
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Rent a Car,
              <span className="block text-blue-400 mt-1">Your Way</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl">
              Choose from Suzuki, Honda, Toyota and more. Self-drive or with a verified driver.
              Simple booking, instant WhatsApp confirmation.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/cars">
                <Button size="lg" rightIcon={<ArrowRight size={18} />}>Find a Car</Button>
              </Link>
              <a href="https://wa.me/923104330007" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="secondary" className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="absolute bottom-0 inset-x-0 bg-white/5 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {[
                { v: '500+', l: 'Bookings Done' },
                { v: '11', l: 'Car Models' },
                { v: '4.8★', l: 'Customer Rating' },
                { v: '24/7', l: 'Support' },
              ].map(({ v, l }) => (
                <div key={l} className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-white">{v}</div>
                  <div className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose PrimeRide?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">We make car rental simple, transparent and reliable across Pakistan.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Verified Cars', desc: 'All vehicles are regularly inspected and in excellent condition.', color: 'bg-blue-100 text-blue-600' },
              { icon: Clock, title: 'Quick Booking', desc: 'Book in minutes via our website or WhatsApp. No paperwork hassle.', color: 'bg-green-100 text-green-600' },
              { icon: CheckCircle2, title: 'Instant Confirmation', desc: 'Get WhatsApp confirmation immediately after booking.', color: 'bg-purple-100 text-purple-600' },
              { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Call or WhatsApp us anytime. We\'re always here to help.', color: 'bg-amber-100 text-amber-600' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-slate-300 max-w-lg mx-auto">Booking a car takes less than 3 minutes</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 mb-12">
            {[
              { step: '01', title: 'Choose Your Car', desc: 'Browse available cars and pick the one that fits your needs and budget.' },
              { step: '02', title: 'Fill Booking Form', desc: 'Enter your details, dates and pickup location. Takes 2 minutes.' },
              { step: '03', title: 'We Contact You', desc: 'We\'ll WhatsApp you within minutes to confirm your booking.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_20px_60px_rgba(15,23,42,0.25)] backdrop-blur-sm">
                <div className="w-14 h-14 rounded-full bg-amber-400/15 border border-amber-300/20 flex items-center justify-center text-amber-200 font-bold text-lg mx-auto mb-4">
                  {step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/cars">
              <Button size="lg" variant="secondary" className="!bg-amber-400 !text-slate-950 hover:!bg-amber-300">
                Book a Car Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What Customers Say</h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1,2,3,4,5].map(i => <Star key={i} size={20} className="fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-gray-500">4.8 out of 5 based on 500+ bookings</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: 'Ahmed R.', city: 'Lahore', text: 'Amazing service! Booked a Honda City and it was in perfect condition. Driver was very professional. Will definitely book again.', rating: 5 },
              { name: 'Sara K.', city: 'Lahore', text: 'Very easy to book via WhatsApp. The Toyota Corolla was clean and comfortable. Price was very reasonable. Highly recommended!', rating: 5 },
              { name: 'Usman T.', city: 'Lahore', text: 'Quick response and great car. The Suzuki Swift was perfect for my trip. No hidden charges, very transparent pricing.', rating: 5 },
            ].map(({ name, city, text, rating }) => (
              <div key={name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-400">{city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Hit the Road?</h2>
          <p className="text-gray-500 mb-8 text-lg">Browse our full fleet and request a booking. We'll contact you via WhatsApp within minutes.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/cars">
              <Button size="lg" rightIcon={<ArrowRight size={18} />}>Browse Cars</Button>
            </Link>
            <a href="https://wa.me/923104330007?text=Hi%2C%20I%20want%20to%20book%20a%20car" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary">Chat on WhatsApp</Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
