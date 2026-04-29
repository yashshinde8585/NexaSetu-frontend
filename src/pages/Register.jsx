import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
} from 'lucide-react';
import MetricsService from '../api/metricsService';

const Register = () => {
  const { register: authRegister } = useAuth();
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
  const navigate = useNavigate();

  const abortControllerRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      // Abort active requests to prevent state updates on unmounted component
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    // Cancel previous pending requests before starting a new registration attempt
    abortControllerRef.current = new AbortController();

    try {
      const { workspaceName, admin, name, email, password } = formData;

      if (!workspaceName.trim() || !admin.trim() || !name.trim() || !email.trim() || !password.trim()) {
        throw new Error('Please fill in all required fields to create your workspace.');
      }

      if (admin.trim().length < 2) {
        throw new Error('Administrator name must be at least 2 characters long.');
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters for security.');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address.');
      }

      await authRegister(
        formData.name,
        formData.email,
        formData.password,
        'WORKSPACE_ADMIN',
        null,
        formData.workspaceName,
        plan,
        formData.admin,
        { signal: abortControllerRef.current.signal }
      );

      if (isMounted.current) {
        MetricsService.trackSignup(formData.workspaceName, plan);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (isMounted.current) {
        setError(err.message || 'Workspace creation failed. Please check your details.');
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
      <div className="flex-1 flex items-center justify-center p-4 relative font-sans">
        <div className="w-full max-w-4xl relative">
          <div className="bg-black border border-white/10 rounded overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 p-6 flex flex-col items-start text-left border-b lg:border-b-0 lg:border-r border-white/10 lg:sticky lg:top-0">
                <h2 className="text-[14px] font-black text-white mb-2">
                  Create workspace
                </h2>
                <p className="text-white/40 text-[9px] font-black leading-relaxed max-w-[280px] mb-6 lg:mb-auto">
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

              <div className="lg:col-span-7 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <span>Initializing...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Setup</span>
                        <ArrowRight size={12} />
                      </>
                    )}
                  </button>
                </form>

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
