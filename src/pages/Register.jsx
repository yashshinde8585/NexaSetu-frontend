import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthActions } from '../context/AuthContext';
import { ROUTES } from '../constants';
import { useSignUp } from '@clerk/clerk-react';
import Navbar from '../components/layouts/Navbar';
import {
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  Mail,
  Lock,
  Activity,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import MetricsService from '../api/metricsService';

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
  useEffect(() => {
    isMounted.current = true;
    // Only cleanup on unmount
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
      const { workspaceName, admin, name, email, password } = formData;

      if (!workspaceName.trim() || !admin.trim() || !name.trim() || !email.trim() || !password.trim()) {
        throw new Error('Please fill in all required fields to create your workspace.');
      }

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
            plan
          }
        });
        console.log('[AUTH-AUDIT] Clerk Signup.create success:', signUpResult.status);

        console.log('[AUTH-AUDIT] Preparing Email Verification...');
        const prepareResult = await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        console.log('[AUTH-AUDIT] Prepare Verification success:', prepareResult.status);
        
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
        if (isMounted.current) navigate('/dashboard');
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

    // Prevent duplicate execution
    if (isVerifyingRef.current || loading || !isLoaded) {
      console.warn('[OTP] Submit locked - already verifying or loading');
      return;
    }

    // Normalize code: trim and remove any internal spaces
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
          throw new Error('Verification succeeded but session activation failed. Please try logging in.');
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
            { headers: { 'x-skip-token': 'true' } }
          );

          // 15s timeout for sync
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Backend sync timed out')), 15000)
          );

          await Promise.race([syncPromise, timeoutPromise]);
          console.log('[OTP] Backend sync success');
        } catch (syncErr) {
          console.error('[OTP] Backend sync warning:', syncErr);
          if (syncErr.status !== 400 && !syncErr.message?.includes('already registered')) {
            throw new Error('Account verified but sync failed. Please contact support or try logging in.');
          }
        }
        
        setVerifyStatus('Redirecting...');
        MetricsService.trackSignup(formData.workspaceName, plan).catch(e => console.warn('Metrics warning:', e));
        
        console.log('[OTP] Redirecting to pricing');
        navigate(ROUTES.PRICING);
      } else {
        console.warn('[OTP] Verification incomplete status:', completeSignUp.status);
        setError(`Verification incomplete. Current status: ${completeSignUp.status}`);
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
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Navbar hideLinks={true} />
      <div className="flex-1 flex items-center justify-center px-4 py-12 md:py-8 pt-24 md:pt-8 relative font-sans">
        <div className="w-full max-w-4xl relative">
          <div className="bg-black border border-white/10 rounded overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 p-5 sm:p-8 flex flex-col items-start text-left border-b lg:border-b-0 lg:border-r border-white/10 lg:sticky lg:top-0 bg-white/[0.02] lg:bg-transparent">
                <h2 className="text-[14px] font-black text-white mb-1">
                  Create workspace
                </h2>
                <p className="text-white/40 text-[9px] font-black leading-relaxed max-w-[280px] mb-4 lg:mb-auto">
                  Set up environment and collaborate.
                </p>

                <div className="mt-8 pt-4 border-t border-white/10 hidden lg:block w-full">
                  <p className="text-white/40 text-[9px] font-black mb-2">
                    Already have account?
                  </p>
                  <Link
                    to="/login"
                    className="text-white text-[9px] font-black hover:underline decoration-white/30 underline-offset-4 transition-all"
                  >
                    Log in
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 p-5 sm:p-8">
                {!verifying ? (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {/* Workspace Name */}
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[9px] font-black text-white/40 block">
                          Company or Team Name
                        </label>
                        <input
                          id="workspaceName"
                          type="text"
                          className="w-full h-9 bg-white/5 border border-white/10 focus:border-white text-white rounded px-3 outline-none transition-all placeholder:text-white/20 text-[10px] font-black"
                          placeholder="e.g. Acme Corp"
                          required
                          maxLength={100}
                          value={formData.workspaceName}
                          onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
                        />
                      </div>

                      {/* Administrator Name */}
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[9px] font-black text-white/40 block">
                          Administrator Name
                        </label>
                        <input
                          id="admin"
                          type="text"
                          className="w-full h-9 bg-white/5 border border-white/10 focus:border-white text-white rounded px-3 outline-none transition-all placeholder:text-white/20 text-[10px] font-black"
                          placeholder="Workspace Administrator"
                          required
                          maxLength={50}
                          value={formData.admin}
                          onChange={(e) => setFormData({ ...formData, admin: e.target.value })}
                        />
                      </div>

                      {/* User Full Name */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-white/40 block">
                          Full Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          className="w-full h-9 bg-white/5 border border-white/10 focus:border-white text-white rounded px-3 outline-none transition-all placeholder:text-white/20 text-[10px] font-black"
                          placeholder="Jane Cooper"
                          required
                          maxLength={50}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-white/40 block">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="w-full h-9 bg-white/5 border border-white/10 focus:border-white text-white rounded px-3 outline-none transition-all placeholder:text-white/20 text-[10px] font-black"
                          placeholder="jane@company.com"
                          required
                          maxLength={255}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>

                      {/* Password */}
                      <div className="md:col-span-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[9px] font-black text-white/40 block">
                            Password
                          </label>
                          <span className="text-[8px] text-white/20 font-black">
                            Min 8 characters
                          </span>
                        </div>
                        <div className="relative group/input">
                          <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className="w-full h-9 bg-white/5 border border-white/10 focus:border-white text-white rounded px-3 outline-none transition-all placeholder:text-white/20 text-[10px] font-black pr-10"
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
                    </div>

                    {error && (
                      <div className="border border-red-500/30 bg-red-500/10 text-red-500 text-[9px] font-black py-2 px-3 text-center rounded">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full h-9 bg-white text-black text-[9px] font-black transition-all rounded flex items-center justify-center gap-2 ${
                        loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/90 active:scale-[0.98]'
                      }`}
                    >
                      {loading ? (
                        <>
                          <Activity className="animate-pulse" size={12} />
                          <span>{verifying ? 'Sending Code...' : 'Initializing...'}</span>
                        </>
                      ) : (
                        <>
                          <span>Complete Setup</span>
                          <ArrowRight size={12} />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerify} className="space-y-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <CheckCircle2 className="text-white" size={20} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-[14px] font-black text-white">Verify your email</h3>
                        <p className="text-white/40 text-[9px] font-black max-w-[240px]">
                          We've sent a 6-digit code to <span className="text-white">{formData.email}</span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-white/40 block text-center">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        className="w-full h-12 bg-white/5 border border-white/10 focus:border-white text-white rounded px-3 outline-none transition-all text-center text-[18px] tracking-[0.5em] font-black"
                        placeholder="000000"
                        required
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>

                    {error && (
                      <div className="border border-red-500/30 bg-red-500/10 text-red-500 text-[9px] font-black py-2 px-3 text-center rounded">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || code.length !== 6}
                      className={`w-full h-9 bg-white text-black text-[9px] font-black transition-all rounded flex items-center justify-center gap-2 ${
                        loading || code.length !== 6 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/90 active:scale-[0.98]'
                      }`}
                    >
                      {loading ? (
                        <>
                          <Activity className="animate-pulse" size={12} />
                          <span>{verifyStatus || 'Preparing Security Check...'}</span>
                        </>
                      ) : (
                        <>
                          <span>Verify Identity</span>
                          <ArrowRight size={12} />
                        </>
                      )}
                    </button>

                    <p className="text-[9px] font-black text-center text-white/40">
                      Didn't receive the code?{' '}
                      <button 
                        type="button" 
                        onClick={() => signUp.prepareEmailAddressVerification({ strategy: 'email_code' })}
                        className="text-white hover:underline transition-all"
                      >
                        Resend
                      </button>
                    </p>
                  </form>
                )}

                <div className="mt-6 lg:hidden text-center pt-4 border-t border-white/10">
                  <p className="text-white/40 text-[9px] font-black mb-1">
                    Already have account?
                  </p>
                  <Link
                    to="/login"
                    className="text-white text-[9px] font-black hover:underline decoration-white/30 underline-offset-4"
                  >
                    Log in
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

export default Register;
