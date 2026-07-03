import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Car, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.username || form.username.length < 2) e.username = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to PrimeRide, ${user.username}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: '' }));
  };

  return (
    <>
      <Helmet><title>Create Account — PrimeRide</title></Helmet>

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

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
              <p className="text-gray-500 text-sm">Join thousands of PrimeRide customers across Pakistan</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Ahmed Khan"
                  value={form.username}
                  onChange={update('username')}
                  error={errors.username}
                  required
                  autoFocus
                />
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update('email')}
                  error={errors.email}
                  required
                  autoComplete="email"
                />
                <Input
                  label="Phone Number (optional)"
                  type="tel"
                  placeholder="+92 310 4330007"
                  value={form.phone}
                  onChange={update('phone')}
                />
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={update('password')}
                  error={errors.password}
                  required
                  autoComplete="new-password"
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />

                <div className="pt-1">
                  <Button type="submit" fullWidth size="lg" isLoading={loading}>
                    Create Account
                  </Button>
                </div>
              </form>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Sign in
              </Link>
            </p>

            <p className="text-center text-xs text-gray-400 mt-3 leading-relaxed">
              By creating an account you agree to our{' '}
              <Link to="/terms" className="underline hover:text-gray-600">Terms</Link>
              {' '}and{' '}
              <Link to="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
