import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 sm:gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <Car size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg text-white">
                Prime<span className="text-blue-400">Ride</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Pakistan's trusted car rental. Suzuki, Honda, Toyota — self-drive or with driver. Book in minutes.
            </p>
            <div className="flex gap-2 pt-1">
              {['FB', 'IG', 'TW'].map(p => (
                <a key={p} href="#" aria-label={p}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center text-[10px] font-bold transition-colors">
                  {p}
                </a>
              ))}
            </div>
          </div>

          {/* Fleet */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Our Fleet</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Suzuki Cars', '/cars?brand=Suzuki'],
                ['Honda Cars', '/cars?brand=Honda'],
                ['Toyota Cars', '/cars?brand=Toyota'],
                ['All Cars', '/cars'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white hover:text-blue-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Company</h3>
            <ul className="space-y-2.5 text-sm">
              {[['About Us', '/about'], ['Contact', '/contact'], ['Terms', '/terms'], ['Privacy', '/privacy']].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-blue-400 shrink-0 mt-0.5" />
                Lahore, Pakistan
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-blue-400 shrink-0" />
                <a href="tel:+923104330007" className="hover:text-white transition-colors">+92 310 4330007</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-blue-400 shrink-0" />
                <a href="mailto:raheelkhan888889@gmail.com" className="hover:text-white transition-colors text-xs break-all">
                  raheelkhan888889@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/923104330007?text=Hi%2C%20I%20want%20to%20book%20a%20car"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#22C35C] text-white text-xs font-semibold rounded-lg transition-colors mt-1"
                >
                  WhatsApp Now
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-center sm:text-left">
          <p>© {new Date().getFullYear()} PrimeRide. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
