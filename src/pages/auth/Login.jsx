import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthActions } from '../../context/AuthContext';
import { useSignIn } from '@clerk/clerk-react';
import Navbar from '../../components/layouts/Navbar';
import {
  Mail,
  Lock,
  ArrowRight,
  Activity,
  Eye,
  EyeOff,
  Shield,
} from 'lucide-react';


const GridMesh = () => {
  const horizontalPaths = [];
  const verticalPaths = [];
  const rows = 12;
  const cols = 16;

  for (let r = 0; r <= rows; r++) {
    const yPercent = r / rows;
    const baseY = 100 + yPercent * 100; // concentrate at the bottom
    let pathD = `M 0 ${baseY}`;
    for (let c = 1; c <= cols; c++) {
      const xPercent = c / cols;
      const x = xPercent * 400;
      const distFromCenter = Math.abs(xPercent - 0.5);
      const wave = Math.sin(xPercent * Math.PI * 1.5) * 15 * yPercent;
      const y =
        baseY + wave - (1 - distFromCenter * distFromCenter) * 10 * yPercent;
      pathD += ` L ${x} ${y}`;
    }
    horizontalPaths.push(pathD);
  }

  for (let c = 0; c <= cols; c++) {
    const xPercent = c / cols;
    const baseX = xPercent * 400;
    let pathD = `M ${baseX} 80`;
    for (let r = 1; r <= rows; r++) {
      const yPercent = r / rows;
      const baseY = 80 + yPercent * 120;
      const distFromCenter = Math.abs(xPercent - 0.5);
      const wave = Math.sin(xPercent * Math.PI * 1.5) * 15 * yPercent;
      const x = baseX + (0.5 - xPercent) * 20 * yPercent;
      const y =
        baseY + wave - (1 - distFromCenter * distFromCenter) * 10 * yPercent;
      pathD += ` L ${x} ${y}`;
    }
    verticalPaths.push(pathD);
  }

  return (
    <svg
      className="absolute bottom-0 left-0 w-full h-full lg:h-[55%] opacity-15 lg:opacity-35 pointer-events-none z-0"
      viewBox="0 0 400 200"
      preserveAspectRatio="none"
      fill="none"
    >
      <defs>
        <linearGradient id="mesh-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.05" />
          <stop offset="40%" stopColor="#3B82F6" stopOpacity="0.35" />
          <stop offset="80%" stopColor="#60A5FA" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {horizontalPaths.map((d, i) => (
        <path
          key={`h-${i}`}
          d={d}
          stroke="url(#mesh-gradient)"
          strokeWidth="0.5"
        />
      ))}
      {verticalPaths.map((d, i) => (
        <path
          key={`v-${i}`}
          d={d}
          stroke="url(#mesh-gradient)"
          strokeWidth="0.5"
        />
      ))}
    </svg>
  );
};

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

  // Force dark mode (obsidian theme) on mount and restore on unmount
  useEffect(() => {
    const root = document.documentElement;
    // Save current theme classes
    const originalClasses = Array.from(root.classList);

    // Remove all theme and accent classes
    root.classList.forEach((cls) => {
      if (cls.startsWith('theme-') || cls.startsWith('accent-')) {
        root.classList.remove(cls);
      }
    });

    // Add dark theme for login
    root.classList.add('theme-obsidian');
    root.classList.add('accent-blue');
    root.style.colorScheme = 'dark';

    return () => {
      // Restore original theme classes
      root.classList.forEach((cls) => {
        if (cls.startsWith('theme-') || cls.startsWith('accent-')) {
          root.classList.remove(cls);
        }
      });
      originalClasses.forEach((cls) => {
        if (cls.startsWith('theme-') || cls.startsWith('accent-')) {
          root.classList.add(cls);
        }
      });
      // Restore color scheme
      const originalTheme =
        originalClasses
          .find((c) => c.startsWith('theme-'))
          ?.replace('theme-', '') || 'obsidian';
      root.style.colorScheme = originalTheme === 'ghost' ? 'light' : 'dark';
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
    <div className="auth-page-theme min-h-screen flex flex-col bg-background text-text relative overflow-hidden">
      {/* Background Dotted Grid */}
      <div className="absolute inset-0 nexa-grid opacity-30 pointer-events-none z-0"></div>

      {/* Top-Left Glowing Ambient Light */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-[120px] pointer-events-none z-0"></div>

      {/* Bottom-Right Glowing Ambient Light */}
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-primary/10 to-transparent blur-[120px] pointer-events-none z-0"></div>

      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-6 pt-20 md:py-8 md:pt-20 relative font-sans z-10">
        <div className="w-full max-w-4xl relative">
          <div className="bg-card border border-border-subtle rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column (Feature Panel) */}
              <div className="lg:col-span-5 relative bg-gradient-to-b from-[#161B22] via-card to-card p-6 sm:p-8 lg:p-10 flex flex-col justify-between items-start text-left border-b lg:border-b-0 lg:border-r border-border-subtle overflow-hidden lg:min-h-[520px]">
                {/* 3D Wireframe Mesh Wave */}
                <GridMesh />

                <div className="relative z-10">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-2 tracking-tight">
                    Welcome back
                  </h2>
                  <p className="text-text-muted text-xs sm:text-sm leading-relaxed max-w-[280px]">
                    Sign in to pick up where your team left off and keep your projects moving.
                  </p>
                </div>

                {/* Bottom link - only shown on desktop in left column */}
                <div className="hidden lg:block mt-auto pt-6 w-full z-10">
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <span>New here?</span>
                    <Link
                      to="/register"
                      className="text-primary font-semibold flex items-center gap-1 hover:text-primary-light hover:underline transition-all"
                    >
                      Create workspace <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column (Form Panel) */}
              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 bg-card flex flex-col justify-center">
                <h3 className="hidden lg:block text-2xl font-bold text-text mb-8 tracking-tight">
                  Sign In
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-4">
                    {/* Email Input */}
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-xs font-semibold text-text-muted block"
                      >
                        Email Address
                      </label>
                      <div className="relative flex items-center">
                        <Mail
                          size={16}
                          className="absolute left-3.5 text-text-muted/50"
                        />
                        <input
                          id="email"
                          type="email"
                          disabled={codeSent}
                          className="w-full h-11 bg-background border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary text-text rounded-lg pl-10 pr-4 outline-none transition-all placeholder:text-text-muted/40 text-sm font-medium disabled:opacity-50"
                          placeholder="name@company.com"
                          required
                          maxLength={255}
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Verification Code or Password Input */}
                    {codeSent ? (
                      <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="text-xs font-semibold text-text-muted block">
                          {isSecondFactor
                            ? 'Security Code'
                            : 'Verification Code'}
                        </label>
                        <div className="relative flex items-center">
                          <Shield
                            size={16}
                            className="absolute left-3.5 text-text-muted/50"
                          />
                          <input
                            type="text"
                            className="w-full h-11 bg-background border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary text-text rounded-lg pl-10 pr-4 outline-none transition-all placeholder:text-text-muted/40 text-sm font-medium"
                            placeholder="000000"
                            required
                            autoFocus
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                          />
                        </div>
                      </div>
                    ) : !isOTP ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label
                            htmlFor="password"
                            className="text-xs font-semibold text-text-muted block"
                          >
                            Password
                          </label>
                          <Link
                            to="/forgot-password"
                            className="text-xs text-primary hover:text-primary-light hover:underline transition-colors font-semibold"
                          >
                            Forgot?
                          </Link>
                        </div>
                        <div className="relative flex items-center">
                          <Lock
                            size={16}
                            className="absolute left-3.5 text-text-muted/50"
                          />
                          <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className="w-full h-11 bg-background border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary text-text rounded-lg pl-10 pr-10 outline-none transition-all placeholder:text-text-muted/40 text-sm font-medium"
                            placeholder="••••••••"
                            required
                            maxLength={128}
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 text-text-muted/50 hover:text-text transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {error && (
                    <div className="border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold py-2.5 px-3 text-center rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full h-11 bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all rounded-lg flex items-center justify-center gap-2 shadow-md shadow-primary/25 ${
                        loading
                          ? 'opacity-50 cursor-not-allowed'
                          : 'active:scale-[0.98]'
                      }`}
                    >
                      {loading ? (
                        <>
                          <Activity
                            className="animate-spin text-white"
                            size={16}
                          />
                          <span>
                            {isOTP && !codeSent
                              ? 'Sending Code...'
                              : 'Verifying...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>
                            {isOTP
                              ? codeSent
                                ? 'Verify Code'
                                : 'Send Login Code'
                              : 'Sign In'}
                          </span>
                          <ArrowRight size={16} className="text-white" />
                        </>
                      )}
                    </button>

                    {useClerk && !codeSent && (
                      <button
                        type="button"
                        onClick={() => setIsOTP(!isOTP)}
                        className="w-full text-center text-xs font-semibold text-text-muted hover:text-text transition-colors pt-2 block"
                      >
                        {isOTP
                          ? 'Use Password instead'
                          : 'Login with email code'}
                      </button>
                    )}
                  </div>
                </form>

                <div className="mt-8 lg:hidden text-center pt-4 border-t border-border-subtle">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
                    <span>New here?</span>
                    <Link
                      to="/register"
                      className="text-primary font-semibold flex items-center gap-1 hover:text-primary-light hover:underline"
                    >
                      Create workspace <ArrowRight size={12} />
                    </Link>
                  </div>
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
