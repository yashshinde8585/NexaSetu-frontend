import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, ShieldCheck, Building, 
  User, Mail, Lock
} from 'lucide-react';

const Register = () => {
    const { register: authRegister } = useAuth();
    const [searchParams] = useSearchParams();
    const plan = searchParams.get('plan') || 'free';

    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '',
        workspaceName: '' 
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
            setError(err.response?.data?.message || 'Registration failed');
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

            <div className="w-full max-w-2xl relative animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-[#1E1E2E]/80 backdrop-blur-2xl p-6 sm:p-10 lg:p-12 rounded-2xl sm:rounded-[2.5rem] border border-white/10 shadow-3xl relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-10">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-3 italic uppercase">
                            Start Your <span className="text-primary not-italic">Intelligence Journey</span>
                        </h2>
                        <p className="text-text-muted font-medium text-sm sm:text-base lg:text-lg leading-relaxed opacity-60">
                            Initialize your workspace orchestrator and take command.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* Workspace Name */}
                             <div className="space-y-2 col-span-1 sm:col-span-2">
                                <label className="text-xs font-bold text-text-muted/80 uppercase tracking-widest ml-1">Workspace Identity</label>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium placeholder:text-white/10 pl-12"
                                        placeholder="e.g. Nexa Global Hub"
                                        required 
                                        value={formData.workspaceName}
                                        onChange={(e) => setFormData({...formData, workspaceName: e.target.value})} 
                                    />
                                    <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-primary transition-colors" size={18} />
                                </div>
                            </div>

                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted/80 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium placeholder:text-white/10 pl-12"
                                        placeholder="John Carter"
                                        required 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                    />
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-primary transition-colors" size={18} />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted/80 uppercase tracking-widest ml-1">Work Email</label>
                                <div className="relative group">
                                    <input 
                                        type="email" 
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium placeholder:text-white/10 pl-12"
                                        placeholder="john@nexasetu.ai"
                                        required 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                    />
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-primary transition-colors" size={18} />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2 col-span-1 sm:col-span-2">
                                <label className="text-xs font-bold text-text-muted/80 uppercase tracking-widest ml-1 flex items-center justify-between">
                                    Secret Key
                                    <span className="text-[10px] text-primary-light lowercase font-medium flex items-center gap-1">
                                        <ShieldCheck size={10} /> secure encryption
                                    </span>
                                </label>
                                <div className="relative group">
                                    <input 
                                        type="password" 
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium placeholder:text-white/10 pl-12"
                                        placeholder="Min. 12 characters"
                                        required 
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                    />
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-primary transition-colors" size={18} />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold py-4 px-5 rounded-2xl text-center flex items-center justify-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-5 px-6 bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-bold rounded-[1.25rem] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-6 flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            <span className="relative z-10 text-lg">
                                {loading ? 'Provisioning Infrastructure...' : 'Deploy Orchestrator'}
                            </span>
                            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-text-muted text-sm font-semibold">
                            Already part of the network? <Link to="/login" className="text-primary hover:text-primary-light transition-colors underline underline-offset-4">Log in to Hub</Link>
                        </p>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 blur-3xl rounded-full" />
            </div>
        </div>
    );
};

export default Register;
