import React, { Suspense, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import MainLayout from './components/layouts/MainLayout';
import Toaster from './components/atoms/Toaster';
import DashboardSkeleton from './components/atoms/DashboardSkeleton';
import ProtectedRoute from './routes/ProtectedRoute';
import { publicRoutes, privateRoutes } from './routes/config';
import { useAuth } from './context/AuthContext';
import { useBilling } from './hooks/useBilling';
import { ROUTES } from './constants';

import ErrorBoundary from './components/atoms/ErrorBoundary';

const App = () => {
  const { user, loading, authReady, loadingMessage } = useAuth();
  const { subscription, isLoading: billingLoading } = useBilling();
  const location = useLocation();

  useEffect(() => {
    const allRoutes = [...publicRoutes, ...privateRoutes];
    const pathSegments = location.pathname.split('/').filter(Boolean);

    const matchedRoute = allRoutes.find((route) => {
      const routeSegments = route.path.split('/').filter(Boolean);
      if (pathSegments.length !== routeSegments.length) return false;
      return routeSegments.every((segment, i) => {
        if (segment.startsWith(':')) return true;
        return segment === pathSegments[i];
      });
    });

    if (matchedRoute?.title) {
      if (matchedRoute.path === '/') {
        document.title = 'NexaSetu – AI Project Orchestration for Engineering Teams';
      } else {
        document.title = `${matchedRoute.title} | NexaSetu`;
      }
    } else {
      document.title = 'NexaSetu – AI Project Orchestration for Engineering Teams';
    }
  }, [location.pathname]);

  const homeRedirect = useMemo(() => {
    if (!user) return '/';

    const isAdmin =
      user.role === 'WORKSPACE_ADMIN' || user.role === 'WORKSPACE_MANAGER';
    if (!billingLoading && !subscription && isAdmin) {
      return ROUTES.PRICING;
    }

    const role = user.role;
    const title = user.jobTitle?.toLowerCase() || '';

    const mappings = [
      { cond: title.includes('cto'), route: ROUTES.COMMAND_CENTER },
      {
        cond: title.includes('vp engineering'),
        route: ROUTES.EXECUTION_COMMANDER,
      },
      {
        cond:
          role === 'ENGINEERING_MANAGER' ||
          title.includes('engineering manager'),
        route: ROUTES.TEAM_COMMAND_CENTER,
      },
      {
        cond: role === 'TECH_LEAD' || title.includes('tech lead'),
        route: ROUTES.SYSTEM_HEALTH_CONTROL,
      },
      { cond: title.includes('qa lead'), route: ROUTES.QUALITY_COMMAND },
      { cond: role === 'HR_MANAGER' || title.includes('hr'), route: ROUTES.HR },
      {
        cond: title.includes('senior qa engineer'),
        route: ROUTES.QUALITY_STRATEGY,
      },
      {
        cond: role === 'QA_ENGINEER' || title.includes('qa engineer'),
        route: ROUTES.QUALITY_CONTROL,
      },
      {
        cond: role === 'SENIOR_ENGINEER' || title.includes('senior engineer'),
        route: ROUTES.EXECUTION_CONTROL,
      },
      {
        cond: title.includes('junior engineer'),
        route: ROUTES.GUIDED_WORK_ASSISTANT,
      },
      {
        cond: role === 'INTERN' || title.includes('intern'),
        route: ROUTES.LEARNING_WORKSPACE,
      },
      { cond: role === 'WORKSPACE_ADMIN', route: ROUTES.ADMIN_PANEL },
    ];

    const match = mappings.find((m) => m.cond);
    return match ? match.route : ROUTES.PERSONAL_WORK_CONSOLE;
  }, [user, subscription, billingLoading]);

  // BOOT LIFECYCLE GATING
  if (!authReady || (user && billingLoading)) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 overflow-hidden">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-primary/10 blur-[100px] animate-pulse rounded-full"></div>
          <div className="absolute inset-0 bg-primary/5 blur-[40px] rounded-full"></div>
          <Loader2
            className="animate-spin text-primary relative z-10 opacity-80"
            size={56}
            strokeWidth={1}
          />
        </div>
        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80">
              Neural Link
            </p>
            <h2 className="text-white font-bold tracking-tighter text-lg">
              NEXASETU CORE
            </h2>
          </div>
          <p className="text-white/40 text-[11px] font-medium tracking-tight max-w-[240px] leading-relaxed">
            {loadingMessage}
          </p>
        </div>

        {/* Visual accents */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-primary/20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <Toaster />
      <Suspense fallback={<DashboardSkeleton />}>
        <Routes>
          {/* Public Routes */}
          {publicRoutes.map(({ path, component: Component, exact }) => (
            <Route
              key={path}
              path={path}
              element={
                (path === '/' ||
                  path === ROUTES.LOGIN ||
                  path === ROUTES.REGISTER) &&
                user ? (
                  <Navigate to={homeRedirect} replace />
                ) : (
                  <ErrorBoundary>
                    <Component />
                  </ErrorBoundary>
                )
              }
            />
          ))}

          {/* Protected Routes */}
          {privateRoutes.map(
            ({
              path,
              component: Component,
              permission,
              roles,
              titles,
              fallback,
            }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute
                    permission={permission}
                    roles={roles}
                    titles={titles}
                    fallback={fallback}
                  >
                    <ErrorBoundary>
                      <Component />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
            )
          )}

          {/* Navigation Overrides */}
          <Route
            path="/team"
            element={<Navigate to={ROUTES.TEAMS} replace />}
          />
          <Route
            path="*"
            element={<Navigate to={user ? homeRedirect : '/'} replace />}
          />
        </Routes>
      </Suspense>
    </MainLayout>
  );
};

export default App;
