// Defines the various access roles available to workspace users.
export const USER_ROLES = {
  WORKSPACE_ADMIN: 'WORKSPACE_ADMIN',
  WORKSPACE_MANAGER: 'WORKSPACE_MANAGER',
  TECH_LEAD: 'TECH_LEAD',
  SENIOR_ENGINEER: 'SENIOR_ENGINEER',
  SOFTWARE_ENGINEER: 'SOFTWARE_ENGINEER',
  PROJECT_MEMBER: 'PROJECT_MEMBER',
  RESTRICTED: 'RESTRICTED',
  INTERN: 'INTERN',
};

// Hierarchical job titles as requested by the user
export const JOB_TITLES = [
  {
    category: 'Engineering Leadership',
    roles: [
      {
        title: 'CTO',
        role: USER_ROLES.WORKSPACE_ADMIN,
        description: 'Executive technical oversight',
      },
      {
        title: 'VP Engineering',
        role: USER_ROLES.WORKSPACE_ADMIN,
        description: 'Strategic engineering leadership',
      },
      {
        title: 'Engineering Manager',
        role: USER_ROLES.WORKSPACE_MANAGER,
        description: 'Team execution & planning',
      },
    ],
  },
  {
    category: 'Engineering (IC + Execution)',
    roles: [
      {
        title: 'Tech Lead',
        role: USER_ROLES.TECH_LEAD,
        description: 'Technical architecture & guidance',
      },
      {
        title: 'Senior Engineer',
        role: USER_ROLES.SENIOR_ENGINEER,
        description: 'Core feature ownership',
      },
      {
        title: 'Software Engineer',
        role: USER_ROLES.SOFTWARE_ENGINEER,
        description: 'Feature development',
      },
      {
        title: 'Junior Engineer',
        role: USER_ROLES.SOFTWARE_ENGINEER,
        description: 'Entry-level development',
      },
      {
        title: 'Intern',
        role: USER_ROLES.INTERN,
        description: 'Restricted learning access',
      },
    ],
  },
  {
    category: 'Quality Assurance (Testing Track)',
    roles: [
      {
        title: 'QA Engineer',
        role: USER_ROLES.SOFTWARE_ENGINEER,
        description: 'Quality verification & testing',
      },
      {
        title: 'Senior QA Engineer',
        role: USER_ROLES.SENIOR_ENGINEER,
        description: 'Advanced testing strategies',
      },
      {
        title: 'QA Lead',
        role: USER_ROLES.TECH_LEAD,
        description: 'QA process leadership',
      },
    ],
  },
  {
    category: 'People / Operations',
    roles: [
      {
        title: 'HR',
        role: USER_ROLES.WORKSPACE_MANAGER,
        description: 'Human resources & operations',
      },
    ],
  },
];

// Lists all specific action permissions applicable within the application.
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
  MANAGE_ROLES: 'MANAGE_ROLES',
};

// Maps each user role to its allowed set of functional permissions.
export const ROLE_PERMISSIONS = {
  [USER_ROLES.WORKSPACE_ADMIN]: ['*'],
  [USER_ROLES.WORKSPACE_MANAGER]: [
    PERMISSIONS.INVITE_USERS,
    PERMISSIONS.VIEW_PORTFOLIO,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.ASSIGN_TASKS,
    PERMISSIONS.CREATE_TASKS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.USE_MAGIC_BAR,
    PERMISSIONS.MANAGE_BILLING,
  ],
  [USER_ROLES.TECH_LEAD]: [
    PERMISSIONS.VIEW_PORTFOLIO,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.ASSIGN_TASKS,
    PERMISSIONS.CREATE_TASKS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.USE_MAGIC_BAR,
  ],
  [USER_ROLES.SENIOR_ENGINEER]: [
    PERMISSIONS.ASSIGN_TASKS,
    PERMISSIONS.CREATE_TASKS,
    PERMISSIONS.USE_MAGIC_BAR,
  ],
  [USER_ROLES.SOFTWARE_ENGINEER]: [
    PERMISSIONS.ASSIGN_TASKS,
    PERMISSIONS.CREATE_TASKS,
  ],
  [USER_ROLES.PROJECT_MEMBER]: [
    PERMISSIONS.ASSIGN_TASKS,
    PERMISSIONS.CREATE_TASKS,
  ],
  [USER_ROLES.INTERN]: [PERMISSIONS.CREATE_TASKS],
  [USER_ROLES.RESTRICTED]: [],
};
