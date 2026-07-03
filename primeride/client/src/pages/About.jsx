import { Helmet } from 'react-helmet-async';
import { Shield, Star, Clock, Car, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const WHATSAPP_NUMBER = '923104330007';

const CONTACT_ITEMS = [
  {
    icon: Phone,
    title: 'Phone',
    value: '+92 339 1919171',
    href: 'tel:+923391919171',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: '+92 310 4330007',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
  },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About PrimeRide — Car Rental Lahore Pakistan</title>
        <meta name="description" content="Learn about PrimeRide — Lahore's trusted car rental service with verified vehicles and professional drivers." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">About PrimeRide</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-2xl">
              PrimeRide is Lahore's trusted car rental platform. Whether you need a reliable Suzuki for daily commute,
              a Toyota Corolla for a family trip, or a premium Honda Civic for a business meeting — we have you covered.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

          {/* Values */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Why Customers Trust Us</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { icon: Shield, title: 'Safety First', desc: 'All vehicles are regularly inspected and maintained. Every driver is background-checked and licensed.', color: 'bg-blue-100 text-blue-600' },
                { icon: Star, title: 'Premium Quality', desc: 'Clean, well-maintained fleet from economy hatchbacks to premium sedans — all in excellent condition.', color: 'bg-amber-100 text-amber-600' },
                { icon: Clock, title: 'Always Available', desc: '24/7 support via WhatsApp. Book any time, we respond within minutes day or night.', color: 'bg-green-100 text-green-600' },
                { icon: Car, title: 'Wide Selection', desc: 'Suzuki WagonR, Alto, Swift, Honda City, Civic, Toyota Corolla, Yaris and all variants available.', color: 'bg-purple-100 text-purple-600' },
              ].map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-base">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mission */}
          <div className="bg-blue-600 rounded-2xl p-8 sm:p-10 text-white">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-blue-100 leading-relaxed text-base mb-6 max-w-2xl">
              To make car rental in Pakistan simple, transparent and accessible. No hidden charges, no paperwork hassle,
              no waiting. Just pick your car, fill a quick form, and we'll contact you within minutes to confirm.
            </p>
            <div className="flex flex-wrap gap-6">
              {[['500+', 'Happy Customers'], ['11', 'Car Models'], ['4.8★', 'Rating']].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-bold">{v}</div>
                  <div className="text-blue-200 text-sm">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact PrimeRide</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {CONTACT_ITEMS.map(({ icon: Icon, title, value, href }) => (
                <a
                  key={title}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{title}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Ready to Book a Car?</h2>
            <p className="text-gray-500 dark:text-gray-300 mb-6">Browse available cars and request a booking in minutes.</p>
            <Link to="/cars">
              <Button size="lg" rightIcon={<ArrowRight size={18} />}>View All Cars</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
