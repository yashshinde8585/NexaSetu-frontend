import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBilling } from '../hooks/useBilling';
import { usePermissions } from '../hooks/usePermissions';
import { ROUTES } from '../constants';

const ProtectedRoute = ({
  children,
  permission,
  roles,
  titles,
  fallback = ROUTES.DASHBOARD,
}) => {
  const { user, loading } = useAuth();
  const { subscription, isLoading: billingLoading } = useBilling();
  const { hasPermission } = usePermissions();
  const location = useLocation();

  // Halt rendering during authentication resolver phase. Billing check logic
  // is deferred to prevent blocking public/non-admin routes.
  if (loading) return null;

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  const isAdmin =
    user.role === 'WORKSPACE_ADMIN' || user.role === 'WORKSPACE_MANAGER';

  // Prevent UI flashing/flickering for administrators while active billing
  // status is retrieved from Stripe/backend.
  if (isAdmin && billingLoading) return null;

  // Business Rule: Workspace administrators must have an active subscription plan to access 
  // administration/dashboard areas. Redirect to the pricing page if no plan is active.
  if (isAdmin && !subscription && location.pathname !== ROUTES.PRICING) {
    return <Navigate to={ROUTES.PRICING} replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to={fallback} replace />;
  }

  if (roles || titles) {
    const userRole = user.role;
    const userTitle = user.jobTitle?.toLowerCase() || '';

    const hasRole = roles ? roles.includes(userRole) : false;
    const hasTitle = titles ? titles.some((t) => userTitle.includes(t)) : false;

    if (!hasRole && !hasTitle) {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
