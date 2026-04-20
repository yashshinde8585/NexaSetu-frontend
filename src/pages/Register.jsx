import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

// Handles new user registration, workspace creation, and plan selection for new tenant accounts.
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Form Validation
      const { workspaceName, admin, name, email, password } = formData;
      
      if (!workspaceName.trim() || !admin.trim() || !name.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in all required fields to create your workspace.');
        setLoading(false);
        return;
      }

      if (admin.trim().length < 2) {
        setError('Administrator name must be at least 2 characters long.');
        setLoading(false);
        return;
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters for security.');
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }
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
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'We couldn\'t create your account. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-[#0f0f0f] p-4 sm:p-6 relative font-sans">
      <div className="w-full max-w-lg relative">
        {/* Main Card */}
        <div className="bg-[#171717] p-6 sm:p-12 rounded-[1.5rem] sm:rounded-[2rem] border border-white/5 shadow-2xl relative z-10">
          {/* Header Section */}
          <div className="mb-8 sm:mb-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Create Your Workspace
            </h2>
            <p className="text-white/40 text-xs sm:text-sm px-4 sm:px-0">
              Set up your environment and start collaborating.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Workspace Name */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-white/60 ml-1 block">
                  Company or Team Name
                </label>
                <div className="relative group/input">
                  <input
                    id="workspaceName"
                    type="text"
                    className="w-full h-12 bg-[#1a1a1a] border border-white/10 focus:border-white/20 text-white rounded-xl px-12 outline-none transition-all placeholder:text-white/10 text-sm"
                    placeholder="e.g., Acme Corp"
                    required
                    value={formData.workspaceName}
                    onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
                  />
                  <Building
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-white transition-colors"
                  />
                </div>
              </div>

              {/* Administrator Name */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-white/60 ml-1 block">
                  Administrator Name
                </label>
                <div className="relative group/input">
                  <input
                    id="admin"
                    type="text"
                    className="w-full h-12 bg-[#1a1a1a] border border-white/10 focus:border-white/20 text-white rounded-xl px-12 outline-none transition-all placeholder:text-white/10 text-sm"
                    placeholder="Workspace Administrator"
                    required
                    value={formData.admin}
                    onChange={(e) => setFormData({ ...formData, admin: e.target.value })}
                  />
                  <ShieldCheck
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-white transition-colors"
                  />
                </div>
              </div>

              {/* User Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60 ml-1 block">
                  Full Name
                </label>
                <div className="relative group/input">
                  <input
                    id="name"
                    type="text"
                    className="w-full h-12 bg-[#1a1a1a] border border-white/10 focus:border-white/20 text-white rounded-xl px-12 outline-none transition-all placeholder:text-white/10 text-sm"
                    placeholder="Jane Cooper"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-white transition-colors"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60 ml-1 block">
                  Email Address
                </label>
                <div className="relative group/input">
                  <input
                    id="email"
                    type="email"
                    className="w-full h-12 bg-[#1a1a1a] border border-white/10 focus:border-white/20 text-white rounded-xl px-12 outline-none transition-all placeholder:text-white/10 text-sm"
                    placeholder="jane@company.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-white transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between ml-1">
                    <label className="text-sm font-medium text-white/60 block">
                      Password
                    </label>
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                      Min 8 characters
                    </span>
                </div>
                <div className="relative group/input">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full h-12 bg-[#1a1a1a] border border-white/10 focus:border-white/20 text-white rounded-xl px-12 outline-none transition-all placeholder:text-white/10 text-sm"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-white hover:bg-white/90 text-black rounded-xl flex items-center justify-center gap-3 font-bold text-base transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center border-t border-white/5 pt-8">
            <p className="text-white/40 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-white font-bold hover:underline transition-colors ml-1"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
