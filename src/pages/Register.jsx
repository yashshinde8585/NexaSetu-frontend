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
      <div className="flex-1 flex items-center justify-center p-6 relative font-sans">
        <div className="w-full max-w-[1150px] relative">
          <div className="bg-[#0A0A0A] border border-white/10 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 p-6 md:p-12 flex flex-col items-start text-left border-b lg:border-b-0 lg:border-r border-white/5 lg:sticky lg:top-0">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tighter uppercase leading-[1]">
                  Create Your <br /> Workspace
                </h2>
                <p className="text-white/30 text-[10px] font-medium uppercase tracking-[0.2em] leading-relaxed max-w-[280px] mb-6 lg:mb-auto">
                  Set up your environment and start collaborating.
                </p>

                <div className="mt-8 lg:mt-12 pt-6 border-t border-white/5 hidden lg:block w-full">
                  <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest mb-3">
                    Already have an account?
                  </p>
                  <Link
                    to="/login"
                    className="text-white text-[9px] font-bold uppercase tracking-widest hover:underline decoration-white/30 underline-offset-8 transition-all"
                  >
                    Log In
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    {/* Workspace Name */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1 block">
                        Company or Team Name
                      </label>
                      <input
                        id="workspaceName"
                        type="text"
                        className="w-full h-12 bg-transparent border border-white/10 focus:border-white text-white rounded-none px-5 outline-none transition-all placeholder:text-white/10 text-xs font-medium"
                        placeholder="e.g., Acme Corp"
                        required
                        maxLength={100}
                        value={formData.workspaceName}
                        onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
                      />
                    </div>

                    {/* Administrator Name */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1 block">
                        Administrator Name
                      </label>
                      <input
                        id="admin"
                        type="text"
                        className="w-full h-12 bg-transparent border border-white/10 focus:border-white text-white rounded-none px-5 outline-none transition-all placeholder:text-white/10 text-xs font-medium"
                        placeholder="Workspace Administrator"
                        required
                        maxLength={50}
                        value={formData.admin}
                        onChange={(e) => setFormData({ ...formData, admin: e.target.value })}
                      />
                    </div>

                    {/* User Full Name */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1 block">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="w-full h-12 bg-transparent border border-white/10 focus:border-white text-white rounded-none px-5 outline-none transition-all placeholder:text-white/10 text-xs font-medium"
                        placeholder="Jane Cooper"
                        required
                        maxLength={50}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1 block">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full h-12 bg-transparent border border-white/10 focus:border-white text-white rounded-none px-5 outline-none transition-all placeholder:text-white/10 text-xs font-medium"
                        placeholder="jane@company.com"
                        required
                        maxLength={255}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    {/* Password */}
                    <div className="md:col-span-2 space-y-2">
                      <div className="flex items-center justify-between ml-1">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 block">
                          Password
                        </label>
                        <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest">
                          Min 8 characters
                        </span>
                      </div>
                      <div className="relative group/input">
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          className="w-full h-12 bg-transparent border border-white/10 focus:border-white text-white rounded-none px-5 outline-none transition-all placeholder:text-white/10 text-xs font-medium"
                          placeholder="••••••••"
                          required
                          maxLength={128}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="border border-white/10 text-white/60 text-[9px] font-bold uppercase tracking-widest py-3 px-6 text-center">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-14 bg-white text-black text-[9px] font-bold uppercase tracking-[0.3em] transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
                      loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/90'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Activity className="animate-pulse" size={14} />
                        <span>Initializing...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Setup</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 lg:hidden text-center pt-6 border-t border-white/5">
                  <p className="text-white/40 text-[9px] uppercase tracking-widest mb-2">
                    Already have an account?
                  </p>
                  <Link
                    to="/login"
                    className="text-white text-[9px] font-bold uppercase tracking-widest hover:underline decoration-white/30 underline-offset-8"
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
