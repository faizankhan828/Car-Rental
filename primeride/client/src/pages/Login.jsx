import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Car, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.username}!`);
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sign in failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Sign In — PrimeRide</title></Helmet>

      <div className="min-h-screen w-full bg-gray-50 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Car size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-gray-900">Prime<span className="text-blue-600">Ride</span></span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft size={14} /> Back to home
          </Link>
        </div>

        {/* Main content */}
        <div className="flex-1 flex">
          {/* Left panel — desktop only */}
          <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1000&q=80"
              alt=""
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
            />
            <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16">
              <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                Your journey starts
                <br />with one click.
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
                Sign in to manage your bookings and access Pakistan's best car rental fleet.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-6">
                {[['500+', 'Bookings'], ['11', 'Car Models'], ['4.8★', 'Rating'], ['24/7', 'Support']].map(([v, l]) => (
                  <div key={l}>
                    <div className="text-2xl font-bold text-white">{v}</div>
                    <div className="text-blue-200 text-sm">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="flex-1 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
                <p className="text-gray-500 text-sm">Sign in to your PrimeRide account</p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                  error={errors.email}
                  required
                  autoComplete="email"
                  autoFocus
                />
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                  error={errors.password}
                  required
                  autoComplete="current-password"
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />

                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" fullWidth size="lg" isLoading={loading}>
                  Sign In
                </Button>
              </form>

              <div className="flex items-center gap-4 my-7">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Sign up free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
