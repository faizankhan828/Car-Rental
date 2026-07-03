import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Car, CalendarCheck, Menu, X, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/admin',          label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/fleet',    label: 'Manage Cars',  icon: Car },
  { to: '/admin/bookings', label: 'Bookings',  icon: CalendarCheck },
];

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out of admin');
    navigate('/');
  };

  const Sidebar = ({ onNav }) => (
    <div className="flex flex-col h-full bg-gray-950 border-r border-gray-800">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2.5" onClick={onNav}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Car size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">
              Prime<span className="text-blue-400">Ride</span>
            </p>
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.15em] mt-0.5">Admin</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={onNav}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
              }`
            }
          >
            <Icon size={16} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}

        {/* Divider */}
        <div className="pt-3 mt-3 border-t border-gray-800">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-all"
          >
            <ExternalLink size={15} strokeWidth={1.8} />
            View Site
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-2.5 mb-1 rounded-xl">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">A</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-200 truncate">Administrator</p>
            <p className="text-[10px] text-gray-500">admin@primeride.pk</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-medium"
        >
          <LogOut size={15} strokeWidth={1.8} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-56 shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed left-0 top-0 bottom-0 w-56 z-50 lg:hidden"
            >
              <Sidebar onNav={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center justify-between h-14 px-4 bg-gray-950 border-b border-gray-800">
          <button onClick={() => setOpen(true)} className="p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors">
            <Menu size={18} />
          </button>
          <span className="text-sm font-bold text-white">Prime<span className="text-blue-400">Ride</span> Admin</span>
          <div className="w-8" />
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-900 p-5 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
