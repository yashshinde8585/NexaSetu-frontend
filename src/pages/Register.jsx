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
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background-dark p-6">
            <div className="w-full max-w-md bg-background border border-background-light rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom duration-500">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-text tracking-tight mb-2">Join NexaSetu</h2>
                    <p className="text-text-muted">Create your account to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-text ml-1">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-background-dark border border-background-light text-text rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-text-muted/50"
                            placeholder="John Doe"
                            required 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        />
                    </div>

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
                        <label className="text-sm font-medium text-text ml-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-background-dark border border-background-light text-text rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-text-muted/50"
                            placeholder="Minimum 8 characters"
                            required 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        />
                        <p className="text-[10px] text-text-muted mt-1.5 px-1 uppercase tracking-wider">Must contain at least 8 characters</p>
                    </div>

                    {error && (
                        <div className="bg-status-error/10 border border-status-error/20 text-status-error text-sm py-2 px-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-primary hover:bg-primary-light disabled:opacity-50 text-text font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? 'Creating Account...' : 'Get Started'}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-background-light text-center text-sm">
                    <span className="text-text-muted">Already have an account? </span>
                    <Link to="/login" className="text-primary-light font-medium hover:text-primary transition-colors underline underline-offset-4">Log in here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
