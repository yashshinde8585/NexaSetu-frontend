import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import AuthService from '../api/authService';
import Navbar from '../components/layouts/Navbar';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await AuthService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send recovery link.');
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
            <h2 className="text-[14px] font-black text-white mb-2 tracking-widest uppercase">
              RECOVER_IDENTITY
            </h2>
            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">
              RESET YOUR ACCESS CREDENTIALS.
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
                className="inline-flex items-center gap-2 text-white text-[9px] font-black uppercase tracking-widest hover:underline decoration-white/30"
              >
                RETURN_TO_LOGIN <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block">
                  EMAIL_ADDRESS
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={14} />
                  <input
                    type="email"
                    required
                    className="w-full h-11 bg-white/5 border border-white/10 focus:border-white text-white rounded pl-10 pr-4 outline-none transition-all placeholder:text-white/20 text-[11px] font-medium tracking-tight"
                    placeholder="ENTER YOUR EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    INITIATING...
                  </>
                ) : (
                  <>
                    SEND_RECOVERY_LINK <ArrowRight size={14} />
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-white/5 text-center">
                <Link
                  to="/login"
                  className="text-white/40 text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors"
                >
                  REMEMBERED? LOG_IN
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
