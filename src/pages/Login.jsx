import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/login', formData);
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('name', data.data.name);
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-950 p-6">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-500">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h2>
                    <p className="text-slate-400">Log in to your NexaSetu account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            <Link to="/" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</Link>
                        </div>
                        <input 
                            type="password" 
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                            placeholder="Enter your password"
                            required 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        />
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
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm">
                    <span className="text-slate-500">New here? </span>
                    <Link to="/register" className="text-blue-400 font-medium hover:text-blue-300 transition-colors underline underline-offset-4">Create an account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
