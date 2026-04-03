// Defines the path strings and route generation functions for application navigation.
export const ROUTES = {
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT_DETAIL: (id) => `/project/${id}`,
  MY_TASKS: '/my-tasks',
  TASK_DETAIL: (id) => `/task/${id}`,
  TEAMS: '/teams',
  SETTINGS: '/settings',
  LOGIN: '/login',
  REGISTER: '/register',
};
