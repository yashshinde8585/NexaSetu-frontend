import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Join from './pages/Join';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import Pricing from './pages/Pricing';
import Team from './pages/Team';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AppTour from './components/AppTour';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './context/AuthContext';

import { Loader2 } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  const getHomeRoute = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/portfolio';
    if (user.role === 'INTERN' && user.assignedProjectId) return `/project/${user.assignedProjectId}`;
    return '/dashboard';
  };

  const isPricing = location.pathname === '/pricing';

  return (
    <>
      <AppTour />
      {user && <Sidebar />}
      <div className={user && !isPricing ? 'ml-64 transition-all' : ''}>
        <Navbar />
        <main className="min-h-[calc(100vh-64px)] overflow-x-hidden">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={user ? <Navigate to={getHomeRoute()} replace /> : <Home />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to={getHomeRoute()} replace />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to={getHomeRoute()} replace />} />
              <Route path="/join" element={<Join />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/team" element={user ? <Team /> : <Navigate to="/login" replace />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/portfolio" element={user ? <Portfolio /> : <Navigate to="/login" replace />} />
              <Route path="/project/:id" element={user ? <ProjectDetail /> : <Navigate to="/login" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </>
  );
}

export default App;
