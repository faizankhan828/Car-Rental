import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { forgotPassword } from '../services/authService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email'); return; }
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Forgot Password — PrimeRide</title></Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-gray-950 pt-16">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Forgot password?</h1>
          <p className="text-gray-500 mb-8">Enter your email and we'll send a reset link.</p>

          {sent ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-700 dark:text-green-400 text-sm mb-6">
              If that email is registered, you'll receive a reset link shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" fullWidth size="lg" isLoading={loading}>
                Send Reset Link
              </Button>
            </form>
          )}
          <p className="text-center text-sm text-gray-500 mt-4">
            <Link to="/login" className="text-amber-600 dark:text-amber-400 hover:underline">Back to Sign In</Link>
          </p>
        </div>
      </div>
    </>
  );
}
