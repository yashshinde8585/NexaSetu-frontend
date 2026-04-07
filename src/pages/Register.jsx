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
} from 'lucide-react';
import Button from '../components/atoms/Button';
import FormField from '../components/molecules/FormField';

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
    <div className="min-h-screen flex items-center justify-center bg-background-dark p-4 sm:p-8 relative overflow-hidden font-sans">
      {/* Decorative background elements for a premium visual effect. */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />

      <div className="w-full max-w-xl relative animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-[#1E1E2E]/85 backdrop-blur-2xl p-6 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-3xl relative z-10 overflow-hidden">
          {/* Suble glow effect at the top of the container. */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Section for the title and introductory text. */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 uppercase">
              Create Your{' '}
              <span className="text-primary text-glow">Workspace</span>
            </h2>
            <p className="text-text-muted font-medium text-sm sm:text-base leading-relaxed opacity-70">
              Set up your team and start managing projects with AI.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Workspace Name */}
              <div className="col-span-1 sm:col-span-2">
                <FormField
                  id="workspaceName"
                  label="Workspace Name"
                  icon={Building}
                  placeholder="e.g. Acme Marketing"
                  required
                  value={formData.workspaceName}
                  onChange={(e) =>
                    setFormData({ ...formData, workspaceName: e.target.value })
                  }
                />
              </div>

              {/* Full Name */}
              <FormField
                id="name"
                label="Full Name"
                icon={User}
                placeholder="John Carter"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              {/* Email */}
              <FormField
                id="email"
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              {/* Password */}
              <div className="col-span-1 sm:col-span-2">
                <FormField
                  id="password"
                  label="Password"
                  labelExtra={
                    <span className="text-[9px] text-primary-light/80 lowercase font-medium flex items-center gap-1">
                      <ShieldCheck size={10} /> min. 8 characters
                    </span>
                  }
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold py-3.5 px-5 rounded-xl text-center flex items-center justify-center gap-3 animate-in slide-in-from-top-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 rounded-xl mt-4 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
              isLoading={loading}
            >
              Create Account
              {!loading && (
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-muted text-xs font-semibold">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary-light transition-colors underline underline-offset-4 decoration-primary/30"
              >
                Sign In
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
