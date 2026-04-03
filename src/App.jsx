import React, { useState, useEffect } from 'react';
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
import ProjectInfo from './pages/ProjectInfo';
import ProjectSettings from './pages/ProjectSettings';
import MyTasks from './pages/MyTasks';
import Velocity from './pages/Velocity';
import TaskDetail from './pages/TaskDetail';
import Navbar from './components/organisms/Navbar';
import MagicResults from './components/organisms/MagicResults';
import Sidebar from './components/organisms/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './context/AuthContext';
import { usePermissions, PERMISSIONS } from './hooks/usePermissions';
import { ROUTES } from './constants';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();
  const { hasPermission } = usePermissions();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [serverDown, setServerDown] = useState(false);

  useEffect(() => {
    const handleServerDown = (e) => {
      setServerDown(true);
    };
    window.addEventListener('app:server-down', handleServerDown);
    return () =>
      window.removeEventListener('app:server-down', handleServerDown);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );

  const getHomeRoute = () => {
    if (!user) return '/';
    return ROUTES.DASHBOARD;
  };

  const isPricing = location.pathname === '/pricing';

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="bg-background min-h-screen">
      {user && <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />}
      <div
        className={`transition-all duration-300 min-h-screen flex flex-col ${user && !isPricing ? 'md:ml-64' : ''}`}
      >
        {serverDown && (
          <div className="bg-red-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.3em] py-2 text-center sticky top-0 z-50 animate-in slide-in-from-top duration-500">
            Connection Interrupted: Strategic Link to Central Intelligence Lost
          </div>
        )}
        <Navbar onToggleSidebar={toggleSidebar} />
        <MagicResults />
        <main className="flex-1 overflow-x-hidden">
          <ErrorBoundary>
            <Routes>
              <Route
                path="/"
                element={
                  user ? <Navigate to={getHomeRoute()} replace /> : <Home />
                }
              />
              <Route
                path={ROUTES.LOGIN}
                element={
                  !user ? <Login /> : <Navigate to={getHomeRoute()} replace />
                }
              />
              <Route
                path={ROUTES.REGISTER}
                element={
                  !user ? (
                    <Register />
                  ) : (
                    <Navigate to={getHomeRoute()} replace />
                  )
                }
              />
              <Route path="/join" element={<Join />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route
                path={ROUTES.TEAMS}
                element={
                  user ? <Team /> : <Navigate to={ROUTES.LOGIN} replace />
                }
              />
              <Route
                path="/team"
                element={<Navigate to={ROUTES.TEAMS} replace />}
              />
              <Route
                path="/team/add"
                element={
                  user ? (
                    hasPermission(PERMISSIONS.INVITE_USERS) ? (
                      <AddTeamMember />
                    ) : (
                      <Navigate to={ROUTES.TEAMS} replace />
                    )
                  ) : (
                    <Navigate to={ROUTES.LOGIN} replace />
                  )
                }
              />
              <Route
                path="/team/project/:projectId"
                element={
                  user ? (
                    <ProjectTeam />
                  ) : (
                    <Navigate to={ROUTES.LOGIN} replace />
                  )
                }
              />
              <Route
                path="/project-info"
                element={
                  user ? (
                    <ProjectInfo />
                  ) : (
                    <Navigate to={ROUTES.LOGIN} replace />
                  )
                }
              />
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  user ? <Dashboard /> : <Navigate to={ROUTES.LOGIN} replace />
                }
              />
              <Route
                path="/project/:id"
                element={
                  user ? (
                    <ProjectDetail />
                  ) : (
                    <Navigate to={ROUTES.LOGIN} replace />
                  )
                }
              />
              <Route
                path="/task/:taskId"
                element={
                  user ? <TaskDetail /> : <Navigate to={ROUTES.LOGIN} replace />
                }
              />
              <Route
                path="/project/:id/settings"
                element={
                  user ? (
                    <ProjectSettings />
                  ) : (
                    <Navigate to={ROUTES.LOGIN} replace />
                  )
                }
              />
              <Route
                path={ROUTES.MY_TASKS}
                element={
                  user ? <MyTasks /> : <Navigate to={ROUTES.LOGIN} replace />
                }
              />
              <Route
                path="/velocity"
                element={
                  user ? <Velocity /> : <Navigate to={ROUTES.LOGIN} replace />
                }
              />
              <Route
                path="/profile"
                element={
                  user ? <Profile /> : <Navigate to={ROUTES.LOGIN} replace />
                }
              />
              <Route
                path={ROUTES.SETTINGS}
                element={
                  user ? <Settings /> : <Navigate to={ROUTES.LOGIN} replace />
                }
              />
              <Route
                path="/theme"
                element={
                  user ? <Theme /> : <Navigate to={ROUTES.LOGIN} replace />
                }
              />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default App;
