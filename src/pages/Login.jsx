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
      <div className="flex-1 flex items-center justify-center p-4 relative font-sans">
        <div className="w-full max-w-4xl relative">
          <div className="bg-black border border-white/10 rounded overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 p-6 flex flex-col items-start text-left border-b lg:border-b-0 lg:border-r border-white/10">
                <h2 className="text-[14px] font-black text-white mb-2">
                  Welcome back
                </h2>
                <p className="text-white/40 text-[9px] font-black leading-relaxed max-w-[280px] mb-6 lg:mb-auto">
                  Sign in to manage workspace.
                </p>

                <div className="mt-8 pt-4 border-t border-white/10 hidden lg:block w-full">
                  <p className="text-white/40 text-[9px] font-black mb-2">
                    No account?
                  </p>
                  <Link
                    to="/register"
                    className="text-white text-[9px] font-black hover:underline decoration-white/30 underline-offset-4 transition-all"
                  >
                    Create workspace
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    {/* Email */}
                    <div className="space-y-1">
                      <label htmlFor="email" className="text-[9px] font-black text-white/40 block">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full h-9 bg-white/5 border border-white/10 focus:border-white text-white rounded px-3 outline-none transition-all placeholder:text-white/20 text-[10px] font-black"
                        placeholder="name@company.com" 
                        required
                        maxLength={255}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label htmlFor="password" className="text-[9px] font-black text-white/40 block">
                          Password
                        </label>
                        <Link
                          to="/forgot-password"
                          className="text-[9px] text-white/40 hover:text-white transition-colors font-black"
                        >
                          Forgot?
                        </Link>
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
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight size={12} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 lg:hidden text-center pt-4 border-t border-white/10">
                  <p className="text-white/40 text-[9px] font-black mb-1">
                    No account?
                  </p>
                  <Link
                    to="/register"
                    className="text-white text-[9px] font-black hover:underline decoration-white/30 underline-offset-4"
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
