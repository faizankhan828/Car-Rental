import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Car, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    login(email.trim(), password)
      .then((user) => {
        if (user.role !== 'admin') {
          setError('Admin access required.');
          return;
        }
        navigate('/admin', { replace: true });
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Helmet><title>Admin Login — PrimeRide</title></Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center px-4 py-12">
        {/* Card */}
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-amber-400/20">
              <Car size={26} className="text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Prime<span className="text-amber-300">Ride</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase">Admin Panel</p>
          </div>

          {/* Form box */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-7 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-2.5 mb-6">
              <ShieldCheck size={18} className="text-amber-300" />
              <h2 className="text-base font-semibold text-white">Sign In to Dashboard</h2>
            </div>

            <div className="mb-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300 leading-relaxed">
              Sign in with the seeded admin account: <span className="font-semibold text-white">admin@primeride.pk</span>.
              The password is the one configured on the server seed.
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="admin@primeride.pk"
                  autoComplete="email"
                  autoFocus
                  className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-semibold rounded-xl transition-colors text-sm mt-2 shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : 'Sign In to Admin'}
              </button>
            </form>
          </div>

          {/* Back link */}
          <p className="text-center mt-6">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">
              ← Back to main site
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
