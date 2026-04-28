import React from 'react';
import { usePermission } from '../hooks/usePermission';

export const PermissionGate = ({ action, children, fallback = null }) => {
  const { hasPermission, loading } = usePermission(action);

  if (loading) return null; // or a tiny spinner
  if (!hasPermission) return fallback;

  return <>{children}</>;
};
