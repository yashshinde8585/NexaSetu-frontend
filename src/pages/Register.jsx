import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/register', formData);
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('name', data.data.name);
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-950 p-6">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom duration-500">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Join NexaSetu</h2>
                    <p className="text-slate-400">Create your account to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                            placeholder="John Doe"
                            required 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                        <input 
                            type="email" 
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                            placeholder="name@example.com"
                            required 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                            placeholder="Minimum 8 characters"
                            required 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        />
                        <p className="text-[10px] text-slate-400 mt-1.5 px-1 uppercase tracking-wider">Must contain at least 8 characters</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-2 px-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? 'Creating Account...' : 'Get Started'}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm">
                    <span className="text-slate-500">Already have an account? </span>
                    <Link to="/login" className="text-blue-400 font-medium hover:text-blue-300 transition-colors underline underline-offset-4">Log in here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
