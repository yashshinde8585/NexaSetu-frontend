import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useSignIn } from '@clerk/clerk-react';
import AuthService from '../api/authService';
import Navbar from '../components/layouts/Navbar';

const ForgotPassword = () => {
  const { isLoaded, signIn } = useSignIn();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const useClerk = import.meta.env.VITE_USE_CLERK_AUTH === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || (useClerk && !isLoaded)) return;
    
    setLoading(true);
    setError('');

    try {
      if (useClerk) {
        await signIn.create({
          strategy: 'reset_password_email_code',
          identifier: email,
        });
        setSuccess(true);
        // In Clerk, we usually stay on the same page or navigate to a reset page
        // Let's navigate to /reset-password/clerk to handle the code entry
        setTimeout(() => navigate('/reset-password/clerk'), 2000);
      } else {
        await AuthService.forgotPassword(email);
        setSuccess(true);
      }
    } catch (err) {
      let message = err.message || 'Failed to send recovery link.';
      if (err.errors && err.errors[0]) {
        message = err.errors[0].message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Navbar hideLinks={true} />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-black border border-white/10 rounded p-8">
          <div className="mb-8 text-center">
            <h2 className="text-[14px] font-black text-white mb-2">
              Recover identity
            </h2>
            <p className="text-white/40 text-[9px] font-black">
              Reset your access credentials.
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle2 className="text-green-500" size={48} strokeWidth={1} />
              </div>
              <p className="text-white/60 text-xs font-medium tracking-tight">
                A recovery link has been dispatched to your email. Please check your inbox (and spam folder).
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-white text-[9px] font-black hover:underline decoration-white/30"
              >
                Return to login <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/40 block">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={14} />
                  <input
                    type="email"
                    required
                    className="w-full h-11 bg-white/5 border border-white/10 focus:border-white text-white rounded pl-10 pr-4 outline-none transition-all placeholder:text-white/20 text-[11px] font-medium tracking-tight"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-[10px] font-black text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-white text-black text-[10px] font-black transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    Initiating...
                  </>
                ) : (
                  <>
                    Send recovery link <ArrowRight size={14} />
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-white/5 text-center">
                <Link
                  to="/login"
                  className="text-white/40 text-[9px] font-black hover:text-white transition-colors"
                >
                  Remembered? Log in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
