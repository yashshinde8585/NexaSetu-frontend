import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 text-slate-100">
            <Link to="/" className="text-xl font-bold tracking-tight hover:text-blue-400 transition-colors">
                NexaSetu
            </Link>
            
            <div className="flex gap-6 items-center">
                {!token ? (
                    <>
                        <Link to="/login" className="text-sm font-medium hover:text-blue-400 transition-colors">
                            Login
                        </Link>
                        <Link to="/register" className="text-sm font-medium hover:text-blue-400 transition-colors border border-blue-500/50 px-4 py-1.5 rounded-xl hover:bg-blue-500/10 transition-all">
                            Register
                        </Link>
                    </>
                ) : (
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-blue-400">
                            {name}
                        </span>
                        <button 
                            onClick={handleLogout}
                            className="text-sm font-medium bg-red-600/10 text-red-400 px-4 py-1.5 rounded-lg hover:bg-red-600/20 transition-all active:scale-95"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
