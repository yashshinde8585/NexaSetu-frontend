import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { ROUTES } from '../constants';

/**
 * ProtectedRoute Component
 * Handles authentication, role-based access, and permission-based navigation.
 */
const ProtectedRoute = ({ 
    children, 
    permission, 
    roles, 
    titles, 
    fallback = ROUTES.DASHBOARD 
}) => {
    const { user, loading } = useAuth();
    const { hasPermission } = usePermissions();
    const location = useLocation();

    if (loading) return null; // Let the main loader handle this

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    // Check specific permissions if required
    if (permission && !hasPermission(permission)) {
        return <Navigate to={fallback} replace />;
    }

    // Check role/title requirements if provided
    if (roles || titles) {
        const userRole = user.role;
        const userTitle = user.jobTitle?.toLowerCase() || '';
        
        const hasRole = roles ? roles.includes(userRole) : false;
        const hasTitle = titles ? titles.some(t => userTitle.includes(t)) : false;

        if (!hasRole && !hasTitle) {
            return <Navigate to={ROUTES.DASHBOARD} replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
