import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const navLinkStyle = ({ isActive }) => 
        `text-sm font-bold transition-all px-3 py-2 rounded-lg ${
            isActive 
            ? 'text-white bg-white/10' 
            : 'text-text-muted hover:text-white hover:bg-white/5'
        } hidden sm:block`;

    return (
        <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 bg-background/80 backdrop-blur-xl border-b border-white/10 shadow-sm transition-all">
            <div className="flex items-center gap-6">
                {!user ? (
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                            <span className="text-xl font-black italic">N</span>
                        </div>
                        <span className="text-lg font-black tracking-tighter text-white">NexaSetu</span>
                    </Link>
                ) : (
                    <>
                        <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-2 py-1 rounded">Project Workspace</div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span className="text-text-muted">/</span> {window.location.pathname === '/portfolio' ? 'Strategic Portfolio' : 'Default Dashboard'}
                        </div>
                    </>
                )}
            </div>
            
            <div className="flex gap-4 items-center">
                {!user ? (
                    <>
                        <Link to="/login" className="text-sm font-bold text-text-muted hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link to="/register" className="text-sm font-bold text-background bg-white hover:bg-gray-200 px-4 py-1.5 rounded-lg transition-all">
                            Register
                        </Link>
                    </>
                ) : (
                    <div className="flex items-center gap-4">
                        <ProfileDropdown />
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
