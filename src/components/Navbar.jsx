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
        <nav className="flex items-center justify-between p-4 bg-background border-b border-background-light text-text shadow-sm">
            <div className="flex items-center gap-8">
                <Link to="/" className="text-xl font-bold tracking-tight hover:text-primary transition-colors">
                    NexaSetu
                </Link>
                {token && (
                    <Link to="/dashboard" className="text-sm font-semibold text-text/80 hover:text-primary transition-colors hidden sm:block">
                        Dashboard
                    </Link>
                )}
            </div>
            
            <div className="flex gap-6 items-center">
                {!token ? (
                    <>
                        <Link to="/login" className="text-sm font-medium hover:text-primary-light transition-colors">
                            Login
                        </Link>
                        <Link to="/register" className="text-sm font-medium hover:text-primary-light transition-colors border border-primary/50 px-4 py-1.5 rounded-xl hover:bg-primary/10 transition-all">
                            Register
                        </Link>
                    </>
                ) : (
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-primary">
                            {name}
                        </span>
                        <button 
                            onClick={handleLogout}
                            className="text-sm font-medium bg-status-error/10 text-status-error px-4 py-1.5 rounded-lg hover:bg-status-error/20 transition-all active:scale-95"
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
