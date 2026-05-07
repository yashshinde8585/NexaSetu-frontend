import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, ArrowRight, Loader2, CheckCircle2, Eye, EyeOff, Hash } from 'lucide-react';
import { useSignIn } from '@clerk/clerk-react';
import AuthService from '../api/authService';
import Navbar from '../components/layouts/Navbar';

const ResetPassword = () => {
  const { token } = useParams();
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const useClerk = import.meta.env.VITE_USE_CLERK_AUTH === 'true' || token === 'clerk';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (loading || (useClerk && !isLoaded)) return;

    setLoading(true);
    setError('');

    try {
      if (useClerk) {
        const result = await signIn.attemptFirstFactor({
          strategy: 'reset_password_email_code',
          code,
          password,
        });

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          setSuccess(true);
          setTimeout(() => navigate('/'), 2000);
        } else {
          console.error(result);
          setError('Reset failed. Please check the code.');
        }
      } else {
        await AuthService.resetPassword(token, password);
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      let message = err.message || 'Failed to reset password.';
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
              Establish new access
            </h2>
            <p className="text-white/40 text-[9px] font-black">
              Enter your new security credentials.
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle2 className="text-green-500" size={48} strokeWidth={1} />
              </div>
              <p className="text-white/60 text-xs font-medium tracking-tight">
                Your credentials have been updated successfully. Redirecting you to login...
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-white text-[9px] font-black hover:underline decoration-white/30"
              >
                Log in now <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {useClerk && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/40 block">
                      Verification Code
                    </label>
                    <div className="relative group">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={14} />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        className="w-full h-11 bg-white/5 border border-white/10 focus:border-white text-white rounded pl-10 pr-4 outline-none transition-all placeholder:text-white/20 text-[11px] font-medium tracking-tight"
                        placeholder="000000"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/40 block">
                    New Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={14} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      className="w-full h-11 bg-white/5 border border-white/10 focus:border-white text-white rounded pl-10 pr-10 outline-none transition-all placeholder:text-white/20 text-[11px] font-medium tracking-tight"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/40 block">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={14} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="w-full h-11 bg-white/5 border border-white/10 focus:border-white text-white rounded pl-10 pr-4 outline-none transition-all placeholder:text-white/20 text-[11px] font-medium tracking-tight"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
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
                    Updating...
                  </>
                ) : (
                  <>
                    Update password <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
