import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layouts/Navbar';
import { Mail, Lock, ArrowRight, Activity, Eye, EyeOff } from 'lucide-react';
import Button from '../components/atoms/Button';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
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

    // Cancel previous pending requests before starting a new login attempt
    abortControllerRef.current = new AbortController();

    try {
      if (!formData.email.trim() || !formData.password.trim()) {
        throw new Error('Please enter both your email and password.');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address.');
      }

      await login(formData.email, formData.password, { 
        signal: abortControllerRef.current.signal 
      });
      
      if (isMounted.current) {
        navigate('/');
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (isMounted.current) {
        setError(err.message || 'Verification failed. Please check your credentials.');
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
        <div className="w-full max-w-[1100px] relative">
          <div className="bg-[#0A0A0A] border border-white/10 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 p-6 md:p-12 flex flex-col items-start text-left border-b lg:border-b-0 lg:border-r border-white/5">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tighter uppercase leading-[1]">
                  Welcome <br /> Back
                </h2>
                <p className="text-white/30 text-[10px] font-medium uppercase tracking-[0.2em] leading-relaxed max-w-[280px] mb-6 lg:mb-auto">
                  Sign in to manage your workspace.
                </p>

                <div className="mt-8 lg:mt-12 pt-6 border-t border-white/5 hidden lg:block w-full">
                  <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest mb-3">
                    Don't have an account?
                  </p>
                  <Link
                    to="/register"
                    className="text-white text-[9px] font-bold uppercase tracking-widest hover:underline decoration-white/30 underline-offset-8 transition-all"
                  >
                    Create Workspace
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-5">
                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1 block">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full h-12 bg-transparent border border-white/10 focus:border-white text-white rounded-none px-5 outline-none transition-all placeholder:text-white/10 text-xs font-medium"
                        placeholder="name@company.com" 
                        required
                        maxLength={255}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label htmlFor="password" className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 block">
                          Password
                        </label>
                        <Link
                          to="/"
                          className="text-[9px] text-white/20 hover:text-white transition-colors font-bold uppercase tracking-widest"
                        >
                          Forgot?
                        </Link>
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
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 lg:hidden text-center pt-6 border-t border-white/5">
                  <p className="text-white/40 text-[9px] uppercase tracking-widest mb-2">
                    Don't have an account?
                  </p>
                  <Link
                    to="/register"
                    className="text-white text-[9px] font-bold uppercase tracking-widest hover:underline decoration-white/30 underline-offset-8"
                  >
                    Create one
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
