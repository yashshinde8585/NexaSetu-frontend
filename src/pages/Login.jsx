import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Button from '../components/atoms/Button';
import FormField from '../components/molecules/FormField';

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
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark p-4 sm:p-8 relative overflow-hidden font-sans">
      {/* Decorative background elements that add a premium feel to the page. */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />

      <div className="w-full max-w-lg relative animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-[#1E1E2E]/85 backdrop-blur-2xl p-6 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-3xl relative z-10 overflow-hidden">
          {/* Subtle glow effect at the top of the login container. */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 uppercase">
              Welcome <span className="text-primary text-glow">Back</span>
            </h2>
            <p className="text-text-muted font-medium text-sm sm:text-base leading-relaxed opacity-70">
              Sign in to your workspace to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              id="email"
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="name@example.com"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <div className="space-y-2">
              <div className="flex justify-between items-center pr-1 -mb-1">
                <label
                  htmlFor="password"
                  className="text-[10px] font-bold text-text-muted/60 uppercase tracking-[0.2em] ml-1"
                >
                  Password
                </label>
                <Link
                  to="/"
                  className="text-[10px] text-primary/80 hover:text-primary transition-colors font-semibold"
                >
                  Forgot Password?
                </Link>
              </div>
              <FormField
                id="password"
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

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold py-3.5 px-5 rounded-xl text-center flex items-center justify-center gap-3 animate-in slide-in-from-top-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 rounded-xl mt-2 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
              isLoading={loading}
            >
              Sign In
              {!loading && (
                <ArrowRight
                  size={17}
                  className="group-hover:translate-x-1 transition-transform"
                />
              )}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-text-muted text-xs font-semibold">
              New to NexaSetu?{' '}
              <Link
                to="/register"
                className="text-primary hover:text-primary-light transition-colors underline underline-offset-4 decoration-primary/30"
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
