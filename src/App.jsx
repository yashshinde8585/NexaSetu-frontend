import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Join from './pages/Join';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import Pricing from './pages/Pricing';
import Team from './pages/Team';
import ProjectTeam from './pages/ProjectTeam';
import AddTeamMember from './pages/AddTeamMember';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Theme from './pages/Theme';
import WorkspaceSettings from './pages/WorkspaceSettings';
import ProjectInfo from './pages/ProjectInfo';
import ProjectSettings from './pages/ProjectSettings';
import MyTasks from './pages/MyTasks';
import Velocity from './pages/Velocity';
import Navbar from './components/Navbar';
import MagicResults from './components/MagicResults';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './context/AuthContext';
import { usePermissions, PERMISSIONS } from './hooks/usePermissions';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();
  const { hasPermission } = usePermissions();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  const getHomeRoute = () => {
    if (!user) return '/';
    return '/dashboard';
  };

  const isPricing = location.pathname === '/pricing';

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="bg-background min-h-screen">
      {user && <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />}
      <div className={`transition-all duration-300 min-h-screen flex flex-col ${user && !isPricing ? 'md:ml-64' : ''}`}>
        <Navbar onToggleSidebar={toggleSidebar} />
        <MagicResults />
        <main className="flex-1 overflow-x-hidden">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={user ? <Navigate to={getHomeRoute()} replace /> : <Home />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to={getHomeRoute()} replace />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to={getHomeRoute()} replace />} />
              <Route path="/join" element={<Join />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/team" element={user ? <Team /> : <Navigate to="/login" replace />} />
              <Route path="/team/add" element={user ? (hasPermission(PERMISSIONS.INVITE_USERS) ? <AddTeamMember /> : <Navigate to="/team" replace />) : <Navigate to="/login" replace />} />
              <Route path="/team/project/:projectId" element={user ? <ProjectTeam /> : <Navigate to="/login" replace />} />
              <Route path="/project-info" element={user ? <ProjectInfo /> : <Navigate to="/login" replace />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/project/:id" element={user ? <ProjectDetail /> : <Navigate to="/login" replace />} />
              <Route path="/project/:id/settings" element={user ? <ProjectSettings /> : <Navigate to="/login" replace />} />
              <Route path="/my-tasks" element={user ? <MyTasks /> : <Navigate to="/login" replace />} />
              <Route path="/velocity" element={user ? <Velocity /> : <Navigate to="/login" replace />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
              <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" replace />} />
              <Route path="/theme" element={user ? <Theme /> : <Navigate to="/login" replace />} />
              <Route path="/workspace-settings" element={user ? (hasPermission(PERMISSIONS.MANAGE_ROLES) ? <WorkspaceSettings /> : <Navigate to="/dashboard" replace />) : <Navigate to="/login" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default App;
