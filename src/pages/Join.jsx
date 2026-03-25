import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Shield, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';

const Join = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { activateInvite } = useAuth();

    const [inviteData, setInviteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', password: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    useEffect(() => {
        if (!token) {
            setError('Invitation token is missing.');
            setLoading(false);
            return;
        }

        const verifyToken = async () => {
            try {
                const res = await api.get(`/team/invites/${token}`);
                setInviteData(res.data.data.invitation);
            } catch (err) {
                setError(err.response?.data?.message || 'Invalid or expired invitation.');
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setStatus('loading');
        setError('');

        try {
            const res = await activateInvite(token, formData.name, formData.password);
            const activatedUser = res.data.data.user;
            
            setStatus('success');
            setTimeout(() => {
                if (activatedUser.role === 'INTERN' && activatedUser.assignedProjectId) {
                    navigate(`/project/${activatedUser.assignedProjectId}`);
                } else {
                    navigate('/dashboard');
                }
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to complete registration.');
            setStatus('error');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
    );

    if (error && !inviteData) return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-background border border-status-error/20 p-8 rounded-3xl text-center shadow-2xl">
                <div className="w-16 h-16 bg-status-error/10 text-status-error rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield size={32} />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Invalid Invite</h1>
                <p className="text-text-muted mb-8">{error}</p>
                <Link to="/login" className="text-primary hover:underline font-bold">Return to Login</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
            <div className="max-w-md w-full bg-background border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                {/* Decorative background pulse */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                
                <div className="relative z-10 text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                        <UserPlus size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Join NexaSetu</h1>
                    <p className="text-text-muted text-sm px-4">You've been invited to join the team as a <span className="text-primary font-bold">{inviteData.role}</span></p>
                </div>

                {status === 'success' ? (
                    <div className="py-12 text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-status-success/20 text-status-success rounded-full flex items-center justify-center mx-auto mb-6 border border-status-success/30">
                            <Shield size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome aboard!</h2>
                        <p className="text-text-muted italic">Setting up your workspace...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        {/* Email (Locked) */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted/60 ml-1">Work Email</label>
                            <div className="relative group opacity-60">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input 
                                    type="email" 
                                    className="w-full bg-background-dark/50 border border-white/10 text-text/50 rounded-xl pl-12 pr-4 py-3 cursor-not-allowed italic"
                                    value={inviteData.email}
                                    disabled
                                />
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-background-light border border-white/10 rounded-lg text-[9px] font-bold text-white shadow-2xl z-50">
                                    Invitations are locked to the recipient's email for governance.
                                </div>
                            </div>
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted/60 ml-1">Full Name</label>
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    className="w-full bg-background-dark border border-white/10 text-text rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-text-muted/30"
                                    placeholder="e.g., John Doe"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted/60 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                                <input 
                                    type="password" 
                                    className="w-full bg-background-dark border border-white/10 text-text rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-text-muted/30"
                                    placeholder="Choose a strong password"
                                    required
                                    minLength="8"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-status-error/10 border border-status-error/20 text-status-error text-[11px] font-bold py-3 px-4 rounded-xl text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={status === 'loading'}
                            className="w-full py-4 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            {status === 'loading' ? (
                                <><Loader2 className="animate-spin" size={18} /> Building Profile...</>
                            ) : 'Complete Signup'}
                        </button>
                    </form>
                )}

                <p className="mt-8 text-center text-xs text-text-muted">
                    This account will be created under corporate governance.
                </p>
            </div>
        </div>
    );
};

export default Join;
