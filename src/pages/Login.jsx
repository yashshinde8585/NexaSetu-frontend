import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

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
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />

            <div className="w-full max-w-lg relative animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-[#1E1E2E]/85 backdrop-blur-2xl p-6 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-3xl relative z-10 overflow-hidden">
                    {/* Inner Glow Effect */}
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
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted/60 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <div className="relative group">
                                <input 
                                    type="email" 
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-5 py-3.5 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium placeholder:text-white/20 pl-12"
                                    placeholder="name@example.com"
                                    required 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                />
                                <Mail className="absolute left-4.5 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-primary transition-colors" size={17} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-bold text-text-muted/60 uppercase tracking-[0.2em]">Password</label>
                                <Link to="/" className="text-[10px] text-primary/80 hover:text-primary transition-colors font-semibold">Forgot Password?</Link>
                            </div>
                            <div className="relative group">
                                <input 
                                    type="password" 
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-5 py-3.5 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium placeholder:text-white/20 pl-12"
                                    placeholder="••••••••"
                                    required 
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                />
                                <Lock className="absolute left-4.5 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-primary transition-colors" size={17} />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold py-3.5 px-5 rounded-xl text-center flex items-center justify-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 px-6 bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-bold rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                             <span className="relative z-10 uppercase tracking-widest text-xs">
                                {loading ? 'Signing in...' : 'Sign In'}
                            </span>
                            <ArrowRight size={17} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                         <p className="text-text-muted text-xs font-semibold">
                            New to NexaSetu? <Link to="/register" className="text-primary hover:text-primary-light transition-colors underline underline-offset-4 decoration-primary/30">Create an account</Link>
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
