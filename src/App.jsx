import React, { Suspense, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import MainLayout from './components/layouts/MainLayout';
import Toaster from './components/atoms/Toaster';
import ProtectedRoute from './routes/ProtectedRoute';
import { publicRoutes, privateRoutes } from './routes/config';
import { useAuth } from './context/AuthContext';
import { useBilling } from './hooks/useBilling';
import { ROUTES } from './constants';

const App = () => {
    const { user, loading, loadingMessage } = useAuth();
    const { subscription, isLoading: billingLoading } = useBilling();

    const homeRedirect = useMemo(() => {
        if (!user) return '/';
        
        // If no active subscription and user is an admin, force pricing page
        if (!billingLoading && !subscription && (user.role === 'WORKSPACE_ADMIN' || user.role === 'WORKSPACE_MANAGER')) {
            return ROUTES.PRICING;
        }

        const role = user.role;
        const title = user.jobTitle?.toLowerCase() || '';

        const mappings = [
            { cond: title.includes('cto'), route: ROUTES.COMMAND_CENTER },
            { cond: title.includes('vp engineering'), route: ROUTES.EXECUTION_COMMANDER },
            { cond: role === 'ENGINEERING_MANAGER' || title.includes('engineering manager'), route: ROUTES.TEAM_COMMAND_CENTER },
            { cond: role === 'TECH_LEAD' || title.includes('tech lead'), route: ROUTES.SYSTEM_HEALTH_CONTROL },
            { cond: title.includes('qa lead'), route: ROUTES.QUALITY_COMMAND },
            { cond: role === 'HR_MANAGER' || title.includes('hr') || title.includes('hr manager'), route: ROUTES.HR } ,
            { cond: title.includes('senior qa engineer'), route: ROUTES.QUALITY_STRATEGY },
            { cond: role === 'QA_ENGINEER' || title.includes('qa engineer'), route: ROUTES.QUALITY_CONTROL },
            { cond: role === 'SENIOR_ENGINEER' || title.includes('senior engineer'), route: ROUTES.EXECUTION_CONTROL },
            { cond: title.includes('junior engineer'), route: ROUTES.GUIDED_WORK_ASSISTANT },
            { cond: role === 'INTERN' || title.includes('intern'), route: ROUTES.LEARNING_WORKSPACE },
            { cond: role === 'WORKSPACE_ADMIN', route: ROUTES.ADMIN_PANEL },
        ];

        const match = mappings.find(m => m.cond);
        return match ? match.route : ROUTES.PERSONAL_WORK_CONSOLE;
    }, [user, subscription, billingLoading]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                    <Loader2 className="animate-spin text-primary relative z-10" size={64} strokeWidth={1} />
                </div>
                <div className="text-center max-w-xs animate-pulse">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">System Status</p>
                    <p className="text-white/60 text-xs font-medium tracking-tight leading-relaxed">
                        {loadingMessage}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <MainLayout>
            <Toaster />
            <Suspense fallback={
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            }>
                <Routes>
                    {/* Public Routes */}
                    {publicRoutes.map(({ path, component: Component, exact }) => (
                        <Route 
                            key={path} 
                            path={path} 
                            element={
                                (path === '/' || path === ROUTES.LOGIN || path === ROUTES.REGISTER) && user ? (
                                    <Navigate to={homeRedirect} replace />
                                ) : (
                                    <Component />
                                )
                            } 
                        />
                    ))}

                    {/* Protected Routes */}
                    {privateRoutes.map(({ path, component: Component, permission, roles, titles, fallback }) => (
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
                                    <Component />
                                </ProtectedRoute>
                            } 
                        />
                    ))}

                    {/* Navigation Overrides */}
                    <Route path="/team" element={<Navigate to={ROUTES.TEAMS} replace />} />
                    <Route path="*" element={<Navigate to={user ? homeRedirect : '/'} replace />} />
                </Routes>
            </Suspense>
        </MainLayout>
    );
};

export default App;
