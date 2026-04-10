import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Tactical Code Splitting: Lazy loading pages to optimize initial bundle delivery
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const Join = lazy(() => import('./pages/Join'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Team = lazy(() => import('./pages/Team'));
const ProjectTeam = lazy(() => import('./pages/ProjectTeam'));
const AddTeamMember = lazy(() => import('./pages/AddTeamMember'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Theme = lazy(() => import('./pages/Theme'));
const ProjectInfo = lazy(() => import('./pages/ProjectInfo'));
const ProjectSetup = lazy(() => import('./pages/ProjectSetup'));
const ProjectSettings = lazy(() => import('./pages/ProjectSettings'));
const MyTasks = lazy(() => import('./pages/MyTasks'));
const Velocity = lazy(() => import('./pages/Velocity'));
const TaskDetail = lazy(() => import('./pages/TaskDetail'));
const CTODashboard = lazy(() => import('./pages/CTODashboard'));
const VPEDashboard = lazy(() => import('./pages/VPEDashboard'));
const EMDashboard = lazy(() => import('./pages/EMDashboard'));
const TLDashboard = lazy(() => import('./pages/TLDashboard'));
const SEDashboard = lazy(() => import('./pages/SEDashboard'));
const SWEDashboard = lazy(() => import('./pages/SWEDashboard'));
const JREDashboard = lazy(() => import('./pages/JREDashboard'));
const InternDashboard = lazy(() => import('./pages/InternDashboard'));
const QADashboard = lazy(() => import('./pages/QADashboard'));
const SQADashboard = lazy(() => import('./pages/SQADashboard'));
const QALeadDashboard = lazy(() => import('./pages/QALeadDashboard'));
const PeopleOpsDashboard = lazy(() => import('./pages/PeopleOpsDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CreateTeam = lazy(() => import('./pages/CreateTeam'));
const EditTeam = lazy(() => import('./pages/EditTeam'));
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
    const role = user.role;
    const title = user.jobTitle?.toLowerCase() || '';

    // Workspace Admin Level Priority
    if (role === 'WORKSPACE_ADMIN') return ROUTES.ADMIN_PANEL;

    // Executive Level Priority
    if (title.includes('cto')) return ROUTES.COMMAND_CENTER;
    if (title.includes('vp engineering')) return ROUTES.EXECUTION_COMMANDER;
    if (role === 'ENGINEERING_MANAGER' || title.includes('engineering manager')) return ROUTES.TEAM_COMMAND_CENTER;
    if (role === 'TECH_LEAD' || title.includes('tech lead')) return ROUTES.SYSTEM_HEALTH_CONTROL;
    if (title.includes('qa lead')) return ROUTES.QUALITY_COMMAND;
    if (role === 'HR_MANAGER' || title.includes('people ops') || title.includes('hr manager')) return ROUTES.PEOPLE_OPS;
    if (title.includes('senior qa engineer')) return ROUTES.QUALITY_STRATEGY;
    if (role === 'QA_ENGINEER' || title.includes('qa engineer')) return ROUTES.QUALITY_CONTROL;
    if (role === 'SENIOR_ENGINEER' || title.includes('senior engineer')) return ROUTES.EXECUTION_CONTROL;
    if (title.includes('junior engineer')) return ROUTES.GUIDED_WORK_ASSISTANT;
    if (role === 'INTERN' || title.includes('intern')) return ROUTES.LEARNING_WORKSPACE;

    return ROUTES.PERSONAL_WORK_CONSOLE;
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
            <Suspense
              fallback={
                <div className="flex items-center justify-center p-20">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              }
            >
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
                  path="/project-setup"
                  element={
                    user ? (
                      hasPermission(PERMISSIONS.CREATE_PROJECT) ? (
                        <ProjectSetup />
                      ) : (
                        <Navigate to="/dashboard" replace />
                      )
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
                    user ? (
                      user.role === 'WORKSPACE_ADMIN' ? (
                        <Navigate to={ROUTES.ADMIN_PANEL} replace />
                      ) : (
                        <Dashboard />
                      )
                    ) : (
                      <Navigate to={ROUTES.LOGIN} replace />
                    )
                  }
                />
                <Route
                  path={ROUTES.COMMAND_CENTER}
                  element={
                    user && user.role === 'WORKSPACE_ADMIN' ? (
                      <CTODashboard />
                    ) : (
                      <Navigate to={ROUTES.DASHBOARD} replace />
                    )
                  }
                />
                <Route
                  path={ROUTES.EXECUTION_COMMANDER}
                  element={
                    user && (user.role === 'WORKSPACE_ADMIN' || user.role === 'WORKSPACE_MANAGER' || user.role === 'VP_ENGINEERING') ? (
                      <VPEDashboard />
                    ) : (
                      <Navigate to={ROUTES.DASHBOARD} replace />
                    )
                  }
                />
                <Route
                  path={ROUTES.TEAM_COMMAND_CENTER}
                  element={
                    user && (user.role === 'ENGINEERING_MANAGER' || user.jobTitle?.toLowerCase() === 'engineering manager' || user.role === 'WORKSPACE_ADMIN' || user.role === 'TECH_LEAD') ? (
                      <EMDashboard />
                    ) : (
                      <Navigate to={ROUTES.DASHBOARD} replace />
                    )
                  }
                />
                <Route
                  path={ROUTES.SYSTEM_HEALTH_CONTROL}
                  element={
                    user && (user.role === 'TECH_LEAD' || user.jobTitle?.toLowerCase() === 'tech lead' || user.role === 'WORKSPACE_ADMIN' || user.role === 'VP_ENGINEERING') ? (
                      <TLDashboard />
                    ) : (
                      <Navigate to={ROUTES.DASHBOARD} replace />
                    )
                  }
                />
                <Route
                  path={ROUTES.EXECUTION_CONTROL}
                  element={
                    user && (user.role === 'SENIOR_ENGINEER' || user.jobTitle?.toLowerCase() === 'senior engineer' || user.role === 'TECH_LEAD' || user.role === 'WORKSPACE_ADMIN' || user.role === 'VP_ENGINEERING' || user.role === 'ENGINEERING_MANAGER') ? (
                      <SEDashboard />
                    ) : (
                      <Navigate to={ROUTES.DASHBOARD} replace />
                    )
                  }
                />
                <Route
                  path={ROUTES.PERSONAL_WORK_CONSOLE}
                  element={
                    user ? (
                      <SWEDashboard />
                    ) : (
                      <Navigate to={ROUTES.LOGIN} replace />
                    )
                  }
                />
                <Route
                  path={ROUTES.GUIDED_WORK_ASSISTANT}
                  element={
                    user ? (
                      <JREDashboard />
                    ) : (
                      <Navigate to={ROUTES.LOGIN} replace />
                    )
                  }
                />
                <Route
                  path={ROUTES.LEARNING_WORKSPACE}
                  element={
                    user ? (
                      <InternDashboard />
                    ) : (
                      <Navigate to={ROUTES.LOGIN} replace />
                    )
                  }
                />
                <Route
                  path={ROUTES.QUALITY_CONTROL}
                  element={
                    user && (user.role === 'QA_ENGINEER' || user.jobTitle?.toLowerCase() === 'senior qa engineer' || user.role === 'TECH_LEAD' || user.role === 'ENGINEERING_MANAGER' || user.role === 'VP_ENGINEERING' || user.role === 'WORKSPACE_ADMIN') ? (
                      <QADashboard />
                    ) : (
                      <Navigate to={ROUTES.DASHBOARD} replace />
                    )
                  }
                />
                <Route
                  path={ROUTES.QUALITY_STRATEGY}
                  element={
                    user && (user.role === 'QA_ENGINEER' || user.jobTitle?.toLowerCase() === 'qa lead' || user.role === 'TECH_LEAD' || user.role === 'ENGINEERING_MANAGER' || user.role === 'VP_ENGINEERING' || user.role === 'WORKSPACE_ADMIN') ? (
                      <SQADashboard />
                    ) : (
                      <Navigate to={ROUTES.DASHBOARD} replace />
                    )
                  }
                />
                <Route
                  path={ROUTES.QUALITY_COMMAND}
                  element={
                    user && (user.role === 'QA_ENGINEER' || user.jobTitle?.toLowerCase() === 'qa lead' || user.role === 'TECH_LEAD' || user.role === 'ENGINEERING_MANAGER' || user.role === 'VP_ENGINEERING' || user.role === 'WORKSPACE_ADMIN') ? (
                      <QALeadDashboard />
                    ) : (
                      <Navigate to={ROUTES.DASHBOARD} replace />
                    )
                  }
                />
                <Route
                  path={ROUTES.PEOPLE_OPS}
                  element={
                    user && (user.role === 'HR_MANAGER' || user.role === 'WORKSPACE_ADMIN' || user.jobTitle?.toLowerCase() === 'people ops' || user.role === 'VP_ENGINEERING' || user.role === 'ENGINEERING_MANAGER') ? (
                      <PeopleOpsDashboard />
                    ) : (
                      <Navigate to={ROUTES.DASHBOARD} replace />
                    )
                  }
                />
                <Route
                  path={ROUTES.ADMIN_PANEL}
                  element={
                    user && user.role === 'WORKSPACE_ADMIN' ? (
                      <AdminDashboard />
                    ) : (
                      <Navigate to={ROUTES.DASHBOARD} replace />
                    )
                  }
                />
                <Route
                  path="/admin/teams/create"
                  element={
                    user && user.role === 'WORKSPACE_ADMIN' ? (
                      <CreateTeam />
                    ) : (
                      <Navigate to={ROUTES.DASHBOARD} replace />
                    )
                  }
                />
                <Route
                  path="/admin/teams/edit/:id"
                  element={
                    user && user.role === 'WORKSPACE_ADMIN' ? (
                      <EditTeam />
                    ) : (
                      <Navigate to={ROUTES.DASHBOARD} replace />
                    )
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
                  path={ROUTES.PROFILE}
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
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default App;
