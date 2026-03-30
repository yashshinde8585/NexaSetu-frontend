import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background-dark p-4 sm:p-8">
            <div className="w-full max-w-md bg-background border border-background-light rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl animate-in zoom-in duration-500">
                <div className="text-center mb-8 sm:mb-10">
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter mb-2 italic uppercase">Welcome Back</h2>
                    <p className="text-text-muted">Log in to your NexaSetu account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-text ml-1">Email</label>
                        <input 
                            type="email" 
                            className="w-full bg-background-dark border border-background-light text-text rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-text-muted/50"
                            placeholder="name@example.com"
                            required 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-medium text-text">Password</label>
                            <Link to="/" className="text-xs text-primary-light hover:text-primary transition-colors">Forgot password?</Link>
                        </div>
                        <input 
                            type="password" 
                            className="w-full h-11 sm:h-12 bg-background-dark border border-background-light text-text rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-text-muted/50 text-sm"
                            placeholder="Enter your password"
                            required 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        />
                    </div>

                    {error && (
                        <div className="bg-status-error/10 border border-status-error/20 text-status-error text-sm py-2 px-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full h-11 sm:h-12 bg-primary hover:bg-primary-light disabled:opacity-50 text-text font-black uppercase tracking-widest text-[10px] sm:text-xs rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? 'Initiating...' : 'Authorize Instance'}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-background-light text-center text-sm">
                    <span className="text-text-muted">Not registered? </span>
                    <Link to="/register" className="text-primary-light font-medium hover:text-primary transition-colors underline underline-offset-4">Create your instance</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
