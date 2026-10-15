import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthActions } from '../../context/AuthContext';
import { ROUTES } from '../../constants';
import { useSignUp } from '@clerk/clerk-react';
import Navbar from '../../components/layouts/Navbar';
import PropTypes from 'prop-types';
import { sanitizeInput, validateRegisterForm } from '../../utils/validation';
import {
  ArrowRight,
  Building,
  User,
  Mail,
  Lock,
  Activity,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import MetricsService from '../../api/metricsApi';

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

const Register = () => {
  const { register: authRegister } = useAuthActions();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'free';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    workspaceName: '',
    admin: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const useClerk = import.meta.env.VITE_USE_CLERK_AUTH === 'true';

  const abortControllerRef = useRef(null);
  const isMounted = useRef(true);

  // Force dark mode (obsidian theme) on mount and restore on unmount
  useEffect(() => {
    isMounted.current = true;

    const root = document.documentElement;
    const originalClasses = Array.from(root.classList);

    root.classList.forEach((cls) => {
      if (cls.startsWith('theme-') || cls.startsWith('accent-')) {
        root.classList.remove(cls);
      }
    });

    root.classList.add('theme-obsidian');
    root.classList.add('accent-blue');
    root.style.colorScheme = 'dark';

    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

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
      const validationError = validateRegisterForm(formData);
      if (validationError) {
        throw new Error(validationError);
      }

      const sanitizedData = {
        workspaceName: sanitizeInput(formData.workspaceName),
        admin: sanitizeInput(formData.admin),
        name: sanitizeInput(formData.name),
        email: formData.email.trim(),
        password: formData.password,
      };

      setFormData(sanitizedData);

      const { workspaceName, admin, name, email, password } = sanitizedData;

      if (useClerk) {
        console.log('[AUTH-AUDIT] Clerk Signup Start');
        const signUpResult = await signUp.create({
          emailAddress: email,
          password,
          firstName: name.split(' ')[0],
          lastName: name.split(' ').slice(1).join(' '),
          unsafeMetadata: {
            workspaceName,
            admin,
            plan,
          },
        });
        console.log(
          '[AUTH-AUDIT] Clerk Signup.create success:',
          signUpResult.status
        );

        console.log('[AUTH-AUDIT] Preparing Email Verification...');
        const prepareResult = await signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        });
        console.log(
          '[AUTH-AUDIT] Prepare Verification success:',
          prepareResult.status
        );

        setVerifying(true);
      } else {
        console.log('[AUTH-AUDIT] Local Registration Start');
        await authRegister(
          formData.name,
          formData.email,
          formData.password,
          'WORKSPACE_ADMIN',
          null,
          formData.workspaceName,
          plan,
          formData.admin
        );
        console.log('[AUTH-AUDIT] Local Registration success');
        if (isMounted.current) navigate(ROUTES.PRICING);
      }
    } catch (err) {
      console.error('[AUTH-AUDIT] Submission failure:', err);
      let message = err.message || 'Registration failed.';
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

  const [verifyStatus, setVerifyStatus] = useState('');
  const isVerifyingRef = useRef(false);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    console.log('[OTP] Submit triggered');
    console.log('[OTP] Current code:', code);

    if (isVerifyingRef.current || loading || !isLoaded) {
      console.warn('[OTP] Submit locked - already verifying or loading');
      return;
    }

    const normalizedCode = code.trim().replace(/\s+/g, '').replace(/\D/g, '');

    if (normalizedCode.length < 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    isVerifyingRef.current = true;
    setLoading(true);
    setError('');
    setVerifyStatus('Communicating with security server...');

    try {
      if (!signUp) {
        throw new Error('Sign up session lost. Please try registering again.');
      }

      console.log('[OTP] Calling Clerk verification');
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: normalizedCode,
      });

      console.log('[OTP] Verification result:', completeSignUp.status);

      if (completeSignUp.status === 'complete') {
        if (!completeSignUp.createdSessionId) {
          throw new Error(
            'Verification succeeded but session activation failed. Please try logging in.'
          );
        }

        console.log('[OTP] Backend sync start');
        setVerifyStatus('Syncing with backend...');

        try {
          const syncPromise = authRegister(
            formData.name,
            formData.email,
            formData.password,
            'WORKSPACE_ADMIN',
            null,
            formData.workspaceName,
            plan,
            formData.admin,
            completeSignUp.createdUserId,
            { headers: { 'x-skip-token': 'true' } }
          );

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Backend sync timed out')), 15000)
          );

          await Promise.race([syncPromise, timeoutPromise]);
          console.log('[OTP] Backend sync success');
        } catch (syncErr) {
          console.error('[OTP] Backend sync warning:', syncErr);
          const isAlreadyRegistered =
            syncErr.status === 400 &&
            syncErr.message?.toLowerCase().includes('already registered');
          if (!isAlreadyRegistered) {
            throw new Error(
              syncErr.message ||
                'Account verified but sync failed. Please contact support or try logging in.'
            );
          }
        }

        console.log('[OTP] Session activation start');
        setVerifyStatus('Activating session...');

        try {
          await setActive({ session: completeSignUp.createdSessionId });
          console.log('[OTP] Session activation success');
        } catch (activeErr) {
          console.error('[OTP] setActive FAILED:', activeErr);
          throw new Error('Failed to activate session: ' + activeErr.message);
        }

        setVerifyStatus('Redirecting...');
        MetricsService.trackSignup(formData.workspaceName, plan).catch((e) =>
          console.warn('Metrics warning:', e)
        );

        console.log('[OTP] Redirecting to pricing');
        navigate(ROUTES.PRICING);
      } else {
        console.warn(
          '[OTP] Verification incomplete status:',
          completeSignUp.status
        );
        setError(
          `Verification incomplete. Current status: ${completeSignUp.status}`
        );
      }
    } catch (err) {
      console.error('[OTP] Verification Failure:', err);
      let message = err.message || 'Verification failed.';
      if (err.errors && err.errors[0]) {
        message = err.errors[0].message;
      }

      if (isMounted.current) {
        setError(message);
      } else {
        window.alert('Verification Error: ' + message);
      }
    } finally {
      isVerifyingRef.current = false;
      if (isMounted.current) {
        setLoading(false);
        setVerifyStatus('');
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
                    Create Workspace
                  </h2>
                  <p className="text-text-muted text-xs sm:text-sm leading-relaxed max-w-[280px]">
                    Set up your workspace and start collaborating with your
                    team.
                  </p>
                </div>

                {/* Bottom link - only shown on desktop in left column */}
                <div className="hidden lg:block mt-auto pt-6 w-full z-10">
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <span>Already have an account?</span>
                    <Link
                      to="/login"
                      className="text-primary font-semibold flex items-center gap-1 hover:text-primary-light hover:underline transition-all"
                    >
                      Log in <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column (Form Panel) */}
              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 bg-card flex flex-col justify-center">
                {!verifying ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Workspace Name Input */}
                    <div className="space-y-2">
                      <label
                        htmlFor="workspaceName"
                        className="text-xs font-semibold text-text-muted block"
                      >
                        Company or Team Name
                      </label>
                      <div className="relative flex items-center">
                        <Building
                          size={16}
                          className="absolute left-3.5 text-text-muted/50"
                        />
                        <input
                          id="workspaceName"
                          type="text"
                          className="w-full h-11 bg-background border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary text-text rounded-lg pl-10 pr-4 outline-none transition-all placeholder:text-text-muted/40 text-sm font-medium"
                          placeholder="e.g. Acme Corp"
                          required
                          maxLength={100}
                          value={formData.workspaceName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              workspaceName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Administrator Name Input */}
                    <div className="space-y-2">
                      <label
                        htmlFor="admin"
                        className="text-xs font-semibold text-text-muted block"
                      >
                        Administrator Name
                      </label>
                      <div className="relative flex items-center">
                        <User
                          size={16}
                          className="absolute left-3.5 text-text-muted/50"
                        />
                        <input
                          id="admin"
                          type="text"
                          className="w-full h-11 bg-background border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary text-text rounded-lg pl-10 pr-4 outline-none transition-all placeholder:text-text-muted/40 text-sm font-medium"
                          placeholder="Workspace Administrator"
                          required
                          maxLength={50}
                          value={formData.admin}
                          onChange={(e) =>
                            setFormData({ ...formData, admin: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Two-Column Grid: Full Name & Email Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* User Full Name */}
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-xs font-semibold text-text-muted block"
                        >
                          Full Name
                        </label>
                        <div className="relative flex items-center">
                          <User
                            size={16}
                            className="absolute left-3.5 text-text-muted/50"
                          />
                          <input
                            id="name"
                            type="text"
                            className="w-full h-11 bg-background border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary text-text rounded-lg pl-10 pr-4 outline-none transition-all placeholder:text-text-muted/40 text-sm font-medium"
                            placeholder="Jane Cooper"
                            required
                            maxLength={50}
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      {/* Email Address */}
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
                            className="w-full h-11 bg-background border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary text-text rounded-lg pl-10 pr-4 outline-none transition-all placeholder:text-text-muted/40 text-sm font-medium"
                            placeholder="jane@company.com"
                            required
                            maxLength={255}
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className="text-xs font-semibold text-text-muted block"
                        >
                          Password
                        </label>
                        <span className="text-[10px] text-text-muted/60 font-medium">
                          Min 8 characters
                        </span>
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
                          placeholder="Min 8 characters"
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

                    {error && (
                      <div className="border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold py-2.5 px-3 text-center rounded-lg">
                        {error}
                      </div>
                    )}

                    {/* Complete Setup button */}
                    <div className="pt-2">
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
                              {verifying
                                ? 'Sending Code...'
                                : 'Initializing...'}
                            </span>
                          </>
                        ) : (
                          <>
                            <span>Complete Setup</span>
                            <ArrowRight size={16} className="text-white" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* OTP Verification Form */
                  <form
                    onSubmit={handleVerify}
                    className="space-y-6 animate-in fade-in duration-300"
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-status-success/10 flex items-center justify-center border border-status-success/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                        <CheckCircle2 className="text-status-success" size={20} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-text tracking-tight">
                          Verify your email
                        </h3>
                        <p className="text-text-muted text-xs font-medium max-w-[240px]">
                          We&apos;ve sent a 6-digit code to{' '}
                          <span className="text-text font-semibold">
                            {formData.email}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-text-muted block text-center">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        className="w-full h-12 bg-background border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary text-text rounded-lg px-4 outline-none transition-all text-center text-lg tracking-[0.5em] font-semibold"
                        placeholder="000000"
                        required
                        maxLength={6}
                        value={code}
                        onChange={(e) =>
                          setCode(e.target.value.replace(/\D/g, ''))
                        }
                      />
                    </div>

                    {error && (
                      <div className="border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold py-2.5 px-3 text-center rounded-lg">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || code.length !== 6}
                      className={`w-full h-11 bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all rounded-lg flex items-center justify-center gap-2 shadow-md shadow-primary/25 ${
                        loading || code.length !== 6
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
                            {verifyStatus || 'Preparing Security Check...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>Verify Identity</span>
                          <ArrowRight size={16} className="text-white" />
                        </>
                      )}
                    </button>

                    <p className="text-xs font-medium text-center text-text-muted">
                      Didn&apos;t receive the code?{' '}
                      <button
                        type="button"
                        onClick={() =>
                          signUp.prepareEmailAddressVerification({
                            strategy: 'email_code',
                          })
                        }
                        className="text-primary font-semibold hover:underline transition-all ml-1"
                      >
                        Resend
                      </button>
                    </p>
                  </form>
                )}

                <div className="mt-8 lg:hidden text-center pt-4 border-t border-border-subtle">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
                    <span>Already have an account?</span>
                    <Link
                      to="/login"
                      className="text-primary font-semibold flex items-center gap-1 hover:text-primary-light hover:underline"
                    >
                      Log in <ArrowRight size={12} />
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

Register.propTypes = {
  // Add propTypes if props are passed in future, currently empty since it uses hooks
};

export default Register;
