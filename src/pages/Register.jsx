import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, ArrowRight, ShieldCheck, Building } from 'lucide-react';

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
                'ADMIN',
                null, 
                formData.workspaceName,
                plan 
            );
            navigate('/portfolio');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark p-6 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="w-full max-w-md bg-background-dark border border-white/5 rounded-[32px] p-10 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                        <Zap size={10} fill="currentColor" /> Setting up {plan} hub
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-2 italic">Found your Instance</h2>
                    <p className="text-text-muted text-sm font-medium">Register as Workspace Admin</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-text-muted/60 uppercase tracking-widest ml-1">Workspace / Team Name</label>
                        <div className="relative group">
                            <input 
                                type="text" 
                                className="w-full bg-white/5 border border-white/5 text-white rounded-2xl px-5 py-3.5 focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-white/10"
                                placeholder="e.g. Nexa Systems"
                                required 
                                value={formData.workspaceName}
                                onChange={(e) => setFormData({...formData, workspaceName: e.target.value})} 
                            />
                            <Building className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-primary/40 transition-colors" size={18} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-text-muted/60 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/5 text-white rounded-2xl px-5 py-3.5 focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-white/10"
                            placeholder="John Doe"
                            required 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-text-muted/60 uppercase tracking-widest ml-1">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full bg-white/5 border border-white/5 text-white rounded-2xl px-5 py-3.5 focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-white/10"
                            placeholder="name@company.com"
                            required 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        />
                    </div>

                    <div className="space-y-1.5 pt-2">
                        <label className="text-[10px] font-black text-text-muted/60 uppercase tracking-widest ml-1 flex items-center gap-2">
                            Secure Password <ShieldCheck size={10} className="text-primary" />
                        </label>
                        <input 
                            type="password" 
                            className="w-full bg-white/5 border border-white/5 text-white rounded-2xl px-5 py-3.5 focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-white/10"
                            placeholder="Minimum 8 characters"
                            required 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest py-3 px-4 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 px-6 bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Initializing Hub...' : 'Create Strategic Hub'}
                        <ArrowRight size={14} />
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">Already Registered? </span>
                    <Link to="/login" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline transition-all">Command Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
