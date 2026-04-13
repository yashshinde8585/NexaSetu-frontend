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
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authRegister(
        formData.name,
        formData.email,
        formData.password,
        'WORKSPACE_ADMIN',
        null,
        formData.workspaceName,
        plan
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Unable to create your account. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 sm:p-8 relative overflow-hidden font-sans">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />

      <div className="w-full max-w-2xl relative animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-black p-8 sm:p-12 rounded-[2.5rem] border border-white/20 shadow-3xl relative z-10 overflow-hidden">
          {/* Subtle glow effect at the top of the container. */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {/* Section for the title and introductory text. */}
          <div className="text-center mb-10 flex flex-col items-center">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tighter mb-2 uppercase">
              INITIALIZE <span className="text-primary text-glow">COMMAND NEXUS</span>
            </h2>
            <p className="text-white/50 font-black text-[10px] uppercase tracking-[0.2em] leading-relaxed">
              Provision a new workspace sector.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Workspace Name */}
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-1 block">
                  Workspace Designation
                </label>
                <div className="relative group/input">
                  <input
                    id="workspaceName"
                    type="text"
                    className="w-full h-14 bg-black border border-white/20 focus:border-primary focus:bg-white/5 text-white rounded-xl px-12 outline-none transition-all placeholder:text-white/20 text-xs font-black tracking-widest uppercase shadow-inner"
                    placeholder="E.G. ACME INC"
                    required
                    value={formData.workspaceName}
                    onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
                  />
                  <Building
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors"
                  />
                </div>
              </div>
              {/* Full Name */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-1 block">
                  Operator Title
                </label>
                <div className="relative group/input">
                  <input
                    id="name"
                    type="text"
                    className="w-full h-14 bg-black border border-white/20 focus:border-primary focus:bg-white/5 text-white rounded-xl px-12 outline-none transition-all placeholder:text-white/20 text-xs font-black tracking-widest uppercase shadow-inner"
                    placeholder="JOHN CARTER"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-1 block">
                  Email Address
                </label>
                <div className="relative group/input">
                  <input
                    id="email"
                    type="email"
                    className="w-full h-14 bg-black border border-white/20 focus:border-primary focus:bg-white/5 text-white rounded-xl px-12 outline-none transition-all placeholder:text-white/20 text-xs font-black tracking-widest uppercase shadow-inner"
                    placeholder="JOHN@EXAMPLE.COM"
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

              {/* Password */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between ml-1 pb-1">
                    <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] block">
                      Clearance Protocol
                    </label>
                    <span className="text-[9px] text-primary/80 uppercase font-black tracking-[0.1em] flex items-center gap-1.5">
                      <ShieldCheck size={12} /> MIN. 8 CHARS
                    </span>
                </div>
                <div className="relative group/input">
                  <input
                    id="password"
                    type="password"
                    className="w-full h-14 bg-black border border-white/20 focus:border-primary focus:bg-white/5 text-white rounded-xl px-12 outline-none transition-all placeholder:text-white/20 text-xs font-black tracking-[0.4em] uppercase shadow-inner"
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
              {loading ? 'INITIALIZING...' : 'PROVISION COMMAND NEXUS'}
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
              ALREADY REGISTERED?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary-light transition-colors underline underline-offset-4 decoration-primary/30 ml-2"
              >
                ESTABLISH LINK
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

export default Register;
