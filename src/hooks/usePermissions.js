import { useAuth } from '../context/AuthContext';
import { PERMISSIONS, ROLE_PERMISSIONS, USER_ROLES } from '../constants';

export { PERMISSIONS }; // Re-export for compatibility with other files using it from here

// Evaluates user roles against defined permissions to authorize features.
export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission) => {
    if (!user) return false;

    let effectiveRole = user.role;
    if (effectiveRole === 'ADMIN') effectiveRole = USER_ROLES.WORKSPACE_ADMIN;
    if (effectiveRole === 'MANAGER')
      effectiveRole = USER_ROLES.WORKSPACE_MANAGER;

    const safeRole = ROLE_PERMISSIONS[effectiveRole]
      ? effectiveRole
      : USER_ROLES.PROJECT_MEMBER;

    const permissions = ROLE_PERMISSIONS[safeRole] || [];

    return permissions.includes('*') || permissions.includes(permission);
  };

  return { hasPermission };
};
