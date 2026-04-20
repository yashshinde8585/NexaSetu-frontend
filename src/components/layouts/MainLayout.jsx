import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../organisms/Sidebar';
import Navbar from '../organisms/Navbar';
import MagicResults from '../organisms/MagicResults';
import ServerWakeupBanner from '../organisms/ServerWakeupBanner';
import ErrorBoundary from '../ErrorBoundary';
import { useAuth } from '../../context/AuthContext';

/**
 * Main Content Layout
 * Standardizes the application shell across all authenticated views.
 */
const MainLayout = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [serverDown, setServerDown] = useState(false);

    useEffect(() => {
        const handleServerDown = () => setServerDown(true);
        window.addEventListener('app:server-down', handleServerDown);
        return () => window.removeEventListener('app:server-down', handleServerDown);
    }, []);

    const publicPages = ['/', '/login', '/register', '/join', '/pricing'];
    const isPublicPage = publicPages.includes(location.pathname);
    
    // Logic for Application Shell Components
    const showSidebar = user && !isPublicPage;
    const showNavbar = location.pathname === '/' || !isPublicPage;

    const toggleSidebar = () => setSidebarOpen(prev => !prev);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="bg-background min-h-screen selection:bg-primary/30 flex flex-col">
            {showSidebar && <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />}
            
            <div className={`transition-all duration-300 min-h-screen flex flex-col ${showSidebar ? 'md:ml-64' : ''}`}>
                <ServerWakeupBanner />
                
                {serverDown && (
                    <div className="bg-red-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.3em] py-2 text-center sticky top-0 z-50 animate-in slide-in-from-top duration-500">
                        Offline: Connection to server lost
                    </div>
                )}

                {showNavbar && <Navbar onToggleSidebar={toggleSidebar} />}
                
                <div className="flex-1 flex flex-col relative">
                    <MagicResults />
                    <main className="flex-1 overflow-x-hidden">
                        <ErrorBoundary>
                            {children}
                        </ErrorBoundary>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
