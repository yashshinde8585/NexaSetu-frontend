import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Activity } from 'lucide-react';
import Button from '../components/atoms/Button';

// This page allows users to sign in to their account using their email and password.
const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'We couldn\'t verify your account. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 sm:p-8 relative overflow-hidden font-sans">
      {/* Decorative background elements that add a premium feel to the page. */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />

      <div className="w-full max-w-lg relative animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-black p-8 sm:p-12 rounded-[2.5rem] border border-white/20 shadow-3xl relative z-10 overflow-hidden">
          {/* Subtle glow effect at the top of the login container. */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="text-center mb-10 flex flex-col items-center">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tighter mb-2 uppercase">
              Welcome <span className="text-primary text-glow">Back</span>
            </h2>
            <p className="text-white/50 font-black text-[10px] uppercase tracking-[0.2em] leading-relaxed">
              Sign in to access your dashboard and projects.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-1 block">
                Email Address
              </label>
              <div className="relative group/input">
                <input
                  id="email"
                  type="email"
                  className="w-full h-14 bg-black border border-white/20 focus:border-primary focus:bg-white/5 text-white rounded-xl px-12 outline-none transition-all placeholder:text-white/20 text-xs font-black tracking-widest uppercase shadow-inner"
                  placeholder="name@company.com" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end pr-1 pb-1">
                <label
                  htmlFor="password"
                  className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-1 block"
                >
                  Password
                </label>
                <Link
                  to="/"
                  className="text-[9px] text-primary hover:text-primary-light transition-colors font-black uppercase tracking-widest"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group/input">
                <input
                  id="password"
                  type="password"
                  className="w-full h-14 bg-black border border-white/20 focus:border-primary focus:bg-white/5 text-white rounded-xl px-12 outline-none transition-all placeholder:text-white/20 text-xs font-black tracking-[0.3em] uppercase shadow-inner"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="bg-status-error/10 border border-status-error/30 text-status-error text-[10px] font-black uppercase tracking-widest py-4 px-5 rounded-xl text-center flex items-center justify-center gap-3 animate-in slide-in-from-top-2 shadow-inner">
                <div className="w-2 h-2 rounded-full bg-status-error animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-primary hover:bg-primary-dark text-black rounded-xl mt-6 flex items-center justify-center gap-4 uppercase font-black tracking-[0.3em] text-[11px] transition-all shadow-2xl shadow-primary/30 active:scale-[0.98] group"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
              {!loading && (
                <ArrowRight
                  size={18} strokeWidth={2.5}
                  className="group-hover:translate-x-1.5 transition-transform"
                />
              )}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-white/10 pt-8">
            <p className="text-white/50 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary hover:text-primary-light transition-colors underline underline-offset-4 decoration-primary/30 ml-2"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-secondary/15 blur-3xl rounded-full" />
      </div>
    </div>
  );
};

export default Login;
