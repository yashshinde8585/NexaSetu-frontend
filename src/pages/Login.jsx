import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Activity, Eye, EyeOff } from 'lucide-react';
import Button from '../components/atoms/Button';

// This page allows users to sign in to their account using their email and password.
const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!formData.email.trim() || !formData.password.trim()) {
        setError('Please enter both your email and password.');
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'We couldn\'t verify your account. Please check your email and password.');
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
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
              Welcome Back
            </h2>
            <p className="text-white/40 text-xs sm:text-sm text-center px-4 sm:px-0">
              Sign in to manage your strategic workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white/60 ml-1 block">
                  Email Address
                </label>
                <div className="relative group/input">
                  <input
                    id="email"
                    type="email"
                    className="w-full h-12 bg-[#1a1a1a] border border-white/10 focus:border-white/20 text-white rounded-xl px-12 outline-none transition-all placeholder:text-white/10 text-sm"
                    placeholder="name@company.com" 
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
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label htmlFor="password" className="text-sm font-medium text-white/60 block">
                    Password
                  </label>
                  <Link
                    to="/"
                    className="text-[10px] text-white/40 hover:text-white transition-colors font-bold uppercase tracking-widest"
                  >
                    Forgot?
                  </Link>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-white hover:bg-white/90 text-black rounded-xl mt-2 flex items-center justify-center gap-3 font-bold text-base transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-white/5 pt-8">
            <p className="text-white/40 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-white font-bold hover:underline transition-colors ml-1"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
