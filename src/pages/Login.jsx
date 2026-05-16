import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthActions } from '../context/AuthContext';
import { useSignIn } from '@clerk/clerk-react';
import Navbar from '../components/layouts/Navbar';
import { Mail, Lock, ArrowRight, Activity, Eye, EyeOff } from 'lucide-react';
import Button from '../components/atoms/Button';

const Login = () => {
  const { login } = useAuthActions();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOTP, setIsOTP] = useState(false);
  const [isSecondFactor, setIsSecondFactor] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const useClerk = import.meta.env.VITE_USE_CLERK_AUTH === 'true';

  const abortControllerRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || (useClerk && !isLoaded)) return;

    setLoading(true);
    setError('');

    try {
      if (!formData.email.trim()) {
        throw new Error('Please enter your email address.');
      }

      if (useClerk) {
        if (isSecondFactor) {
          // Handle Second Factor (MFA/Verification)
          const result = await signIn.attemptSecondFactor({
            strategy: 'email_code',
            code,
          });

          if (result.status === 'complete') {
            await setActive({ session: result.createdSessionId });
            navigate('/');
          } else {
            throw new Error('Second factor verification failed.');
          }
        } else if (isOTP) {
          if (!codeSent) {
            // Start OTP flow
            const { supportedFirstFactors } = await signIn.create({
              identifier: formData.email,
            });

            const emailCodeFactor = supportedFirstFactors.find(
              (f) => f.strategy === 'email_code'
            );

            if (emailCodeFactor) {
              await signIn.prepareFirstFactor({
                strategy: 'email_code',
                emailAddressId: emailCodeFactor.emailAddressId,
              });
              setCodeSent(true);
            } else {
              throw new Error('OTP login is not available for this account.');
            }
          } else {
            // Verify OTP
            const result = await signIn.attemptFirstFactor({
              strategy: 'email_code',
              code,
            });

            if (result.status === 'complete') {
              await setActive({ session: result.createdSessionId });
              navigate('/');
            } else {
              throw new Error('Verification failed. Please check the code.');
            }
          }
        } else {
          // Normal Password Login
          const result = await signIn.create({
            identifier: formData.email,
            password: formData.password,
          });

          if (result.status === 'complete') {
            await setActive({ session: result.createdSessionId });
            navigate('/');
          } else if (result.status === 'needs_second_factor') {
            // Trigger Second Factor
            await signIn.prepareSecondFactor({ strategy: 'email_code' });
            setIsSecondFactor(true);
            setCodeSent(true);
            setError('Verification code sent to your email.');
          } else {
            setError(`Further verification required: ${result.status}`);
          }
        }
      } else {
        await login(formData.email, formData.password);
        if (isMounted.current) navigate('/');
      }
    } catch (err) {
      let message = err.message || 'Verification failed.';
      if (err.errors && err.errors[0]) {
        message = err.errors[0].message;
      }
      if (isMounted.current) {
        setError(message);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Navbar hideLinks={true} />
      <div className="flex-1 flex items-center justify-center px-4 py-12 md:py-8 pt-24 md:pt-8 relative font-sans">
        <div className="w-full max-w-4xl relative">
          <div className="bg-black border border-white/10 rounded overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 p-5 sm:p-8 flex flex-col items-start text-left border-b lg:border-b-0 lg:border-r border-white/10 bg-white/[0.02] lg:bg-transparent">
                <h2 className="text-[18px] font-black text-white mb-1">
                  Welcome back
                </h2>
                <p className="text-white/40 text-[11px] font-black leading-relaxed max-w-[280px] mb-4 lg:mb-auto">
                  Sign in to manage workspace.
                </p>

                <div className="mt-8 pt-4 border-t border-white/10 hidden lg:block w-full">
                  <p className="text-white/40 text-[11px] font-black mb-2">
                    No account?
                  </p>
                  <Link
                    to="/register"
                    className="text-white text-[11px] font-black hover:underline decoration-white/30 underline-offset-4 transition-all"
                  >
                    Create workspace
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 p-5 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    {/* Email */}
                    <div className="space-y-1">
                      <label htmlFor="email" className="text-[11px] font-black text-white/40 block">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        disabled={codeSent}
                        className="w-full h-9 bg-white/5 border border-white/10 focus:border-white text-white rounded px-3 outline-none transition-all placeholder:text-white/20 text-[12px] font-black disabled:opacity-50"
                        placeholder="name@company.com" 
                        required
                        maxLength={255}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    {codeSent ? (
                      <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="text-[11px] font-black text-white/40 block">
                          {isSecondFactor ? 'Security Code' : 'Verification Code'}
                        </label>
                        <input
                          type="text"
                          className="w-full h-9 bg-white/5 border border-white/10 focus:border-white text-white rounded px-3 outline-none transition-all placeholder:text-white/20 text-[12px] font-black"
                          placeholder="000000"
                          required
                          autoFocus
                          maxLength={6}
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                        />
                      </div>
                    ) : !isOTP ? (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label htmlFor="password" className="text-[11px] font-black text-white/40 block">
                            Password
                          </label>
                          <Link
                            to="/forgot-password"
                            className="text-[10px] text-white/40 hover:text-white transition-colors font-black"
                          >
                            Forgot?
                          </Link>
                        </div>
                        <div className="relative group/input">
                          <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className="w-full h-9 bg-white/5 border border-white/10 focus:border-white text-white rounded px-3 outline-none transition-all placeholder:text-white/20 text-[12px] font-black pr-10"
                            placeholder="••••••••"
                            required
                            maxLength={128}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {error && (
                    <div className="border border-red-500/30 bg-red-500/10 text-red-500 text-[11px] font-black py-2 px-3 text-center rounded">
                      {error}
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full h-11 bg-white text-black text-[11px] font-black transition-all rounded flex items-center justify-center gap-2 ${
                        loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/90 active:scale-[0.98]'
                      }`}
                    >
                      {loading ? (
                        <>
                          <Activity className="animate-pulse" size={12} />
                          <span>{isOTP && !codeSent ? 'Sending Code...' : 'Verifying...'}</span>
                        </>
                      ) : (
                        <>
                          <span>{isOTP ? (codeSent ? 'Verify Code' : 'Send Login Code') : 'Sign In'}</span>
                          <ArrowRight size={12} />
                        </>
                      )}
                    </button>

                    {useClerk && !codeSent && (
                      <button
                        type="button"
                        onClick={() => setIsOTP(!isOTP)}
                        className="w-full text-center text-[11px] font-black text-white/40 hover:text-white transition-colors"
                      >
                        {isOTP ? 'Use Password instead' : 'Login with email code'}
                      </button>
                    )}
                  </div>
                </form>

                <div className="mt-6 lg:hidden text-center pt-4 border-t border-white/10">
                  <p className="text-white/40 text-[11px] font-black mb-1">
                    No account?
                  </p>
                  <Link
                    to="/register"
                    className="text-white text-[11px] font-black hover:underline decoration-white/30 underline-offset-4"
                  >
                    Create workspace
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
