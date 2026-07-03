import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { useAuth } from './context/AuthContext';

// Public pages — no auth required
const Home               = lazy(() => import('./pages/Home'));
const Cars               = lazy(() => import('./pages/Cars'));
const CarDetail          = lazy(() => import('./pages/CarDetail'));
const BookingFlow        = lazy(() => import('./pages/BookingFlow'));
const About              = lazy(() => import('./pages/About'));
const Contact            = lazy(() => import('./pages/Contact'));
const Terms              = lazy(() => import('./pages/Terms'));
const Privacy            = lazy(() => import('./pages/Privacy'));

// Admin pages
const AdminLogin         = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard     = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminFleet         = lazy(() => import('./pages/admin/AdminFleet'));
const AdminBookings      = lazy(() => import('./pages/admin/AdminBookings'));

// Admin route guard — checks adminStore, no server call needed
function AdminRoute({ children }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner fullPage />;
  if (user?.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <Routes>

        {/* ── Public routes (no login needed) ── */}
        <Route element={<Layout />}>
          <Route path="/"           element={<Home />} />
          <Route path="/cars"       element={<Cars />} />
          <Route path="/cars/:id"   element={<CarDetail />} />
          <Route path="/book/:carId" element={<BookingFlow />} />
          <Route path="/about"      element={<About />} />
          <Route path="/contact"    element={<Contact />} />
          <Route path="/terms"      element={<Terms />} />
          <Route path="/privacy"    element={<Privacy />} />
        </Route>

        {/* ── Admin login (standalone, no navbar) ── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ── Admin panel (protected by adminStore) ── */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/fleet" element={<AdminRoute><AdminFleet /></AdminRoute>} />
        <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />

        {/* ── Catch-all ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Suspense>
  );
}
