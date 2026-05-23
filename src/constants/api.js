// Defines the project identifier for the ticket management system.
export const TICKETS_PROJECT_ID =
  import.meta.env.VITE_TICKETS_PROJECT_ID || null;

// Contains all API endpoint paths used for backend communication.
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    ACTIVATE: '/auth/activate',
    ONBOARDING: '/auth/complete-tour',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: (token) => `/auth/reset-password/${token}`,
    AVATAR: '/auth/avatar',
  },
  PROJECTS: {
    BASE: '/projects',
    ANALYTICS: (id) => `/projects/${id}/analytics`,
    DETAIL: (id) => `/projects/${id}`,
  },
  TASKS: {
    BASE: '/tasks',
    MY_TASKS: '/tasks/my-tasks',
    BY_PROJECT: (projectId) => `/tasks/project/${projectId}`,
    DETAIL: (id) => `/tasks/${id}`,
  },
  SPRINTS: {
    BASE: '/sprints',
    STATS: (id) => `/sprints/${id}/stats`,
    FINALIZE: (id) => `/sprints/${id}/finalize`,
    REPORT: (id) => `/sprints/${id}/report`,
    DETAIL: (id) => `/sprints/${id}`,
  },
  TEAM: {
    INVITE_BULK: '/team/invite-bulk',
    MEMBERS: '/team/members',
    ROLES: '/team/roles',
    REMOVE_INVITATION: (id) => `/team/invites/${id}`,
  },
  AI: {
    EXTRACT: '/ai/extract',
    RECOMMENDATIONS: '/ai/portfolio-recommendations',
    ACTIVITY_LOGS: '/ai/activity-logs',
  },
  GITHUB: {
    CONNECT: '/github/connect',
    REPOSITORIES: '/github/repositories',
    LINK_PROJECT: '/github/link-project',
    SUGGESTIONS: (id) => `/github/activity-suggestions/${id}`,
    APPROVE_TASKS: '/github/approve-tasks',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
  },
  ACTIONS: {
    PENDING: '/actions/pending',
    APPROVE: (id) => `/actions/${id}/approve`,
    REJECT: (id) => `/actions/${id}/reject`,
  },
  RESOURCES: {
    WORKLOAD: '/resources/workload',
  },
  MAGIC: {
    EXECUTE: '/magic/execute',
  },
  DASHBOARDS: {
    TACTICAL: (role) => `/engineering/workspace`,
    MANAGEMENT: `/leadership/dashboard`,
    OPERATIONS: `/operations/dashboard`,
  },
  CTO: {
    DASHBOARD: `/leadership/dashboard`,
    FUNCTION_DRILLDOWN: (category) => `/leadership/function/${category}/roles`,
    INDIVIDUAL_DRILLDOWN: (role) => `/leadership/roles/${role}/individuals`,
  },
  VPE: {
    DASHBOARD: `/leadership/dashboard`,
    TEAM_DRILLDOWN: (teamName) => `/leadership/team/${teamName}`,
  },
  METRICS: {
    EVENT: '/metrics/event',
  },
};
