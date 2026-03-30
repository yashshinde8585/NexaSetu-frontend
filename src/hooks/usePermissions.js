import { useAuth } from '../context/AuthContext';


const ROLE_PERMISSIONS = {
    WORKSPACE_ADMIN: ['*'],
    WORKSPACE_MANAGER: [
        'INVITE_USERS',
        'VIEW_PORTFOLIO',
        'CREATE_PROJECT',
        'EDIT_PROJECT',
        'ASSIGN_TASKS',
        'CREATE_TASKS',
        'VIEW_ANALYTICS',
        'USE_MAGIC_BAR'
    ],
    PROJECT_MEMBER: [
        'ASSIGN_TASKS',
        'CREATE_TASKS'
    ],
    RESTRICTED: []
};

// Map of capability constants for frontend consistency
export const PERMISSIONS = {
    INVITE_USERS: 'INVITE_USERS',
    VIEW_PORTFOLIO: 'VIEW_PORTFOLIO',
    CREATE_PROJECT: 'CREATE_PROJECT',
    EDIT_PROJECT: 'EDIT_PROJECT',
    ASSIGN_TASKS: 'ASSIGN_TASKS',
    CREATE_TASKS: 'CREATE_TASKS',
    VIEW_ANALYTICS: 'VIEW_ANALYTICS',
    MANAGE_BILLING: 'MANAGE_BILLING',
    USE_MAGIC_BAR: 'USE_MAGIC_BAR',
    MANAGE_ROLES: 'MANAGE_ROLES'
};

export const usePermissions = () => {
    const { user } = useAuth();

    const hasPermission = (permission) => {
        if (!user) return false;
        
        // Handle migration fallback for legacy roles if any
        let effectiveRole = user.role;
        if (effectiveRole === 'ADMIN') effectiveRole = 'WORKSPACE_ADMIN';
        if (effectiveRole === 'MANAGER') effectiveRole = 'WORKSPACE_MANAGER';
        
        const safeRole = ROLE_PERMISSIONS[effectiveRole] ? effectiveRole : 'PROJECT_MEMBER';
        
        const permissions = ROLE_PERMISSIONS[safeRole] || [];
        
        // Super-admin wildcard check or explicit permission match
        return permissions.includes('*') || permissions.includes(permission);
    };

    return { hasPermission };
};
