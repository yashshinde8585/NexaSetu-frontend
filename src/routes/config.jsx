import React, { lazy } from 'react';
import { ROUTES } from '../constants';
import { PERMISSIONS } from '../hooks/usePermissions';

// Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const Home = lazy(() => import('../pages/common/Home'));
const Join = lazy(() => import('../pages/auth/Join'));
const Dashboard = lazy(() => import('../pages/dashboards/Dashboard'));
const ProjectDetail = lazy(() => import('../pages/projects/ProjectDetail'));
const ProjectWarRoom = lazy(() => import('../pages/projects/ProjectWarRoom'));
const Pricing = lazy(() => import('../pages/common/Pricing'));
const Team = lazy(() => import('../pages/teams/Team'));
const ProjectTeam = lazy(() => import('../pages/projects/ProjectTeam'));
const AddTeamMember = lazy(() => import('../pages/teams/AddTeamMember'));
const Profile = lazy(() => import('../pages/common/Profile'));
const Settings = lazy(() => import('../pages/common/Settings'));
const Theme = lazy(() => import('../pages/common/Theme'));
const ProjectInfo = lazy(() => import('../pages/projects/ProjectInfo'));
const ProjectSetup = lazy(() => import('../pages/projects/ProjectSetup'));
const ProjectSettings = lazy(() => import('../pages/projects/ProjectSettings'));
const MyTasks = lazy(() => import('../pages/tasks/MyTasks'));
const Velocity = lazy(() => import('../pages/common/Velocity'));
const TaskDetail = lazy(() => import('../pages/tasks/TaskDetail'));
const CTODashboard = lazy(
  () => import('../pages/dashboards/executive/CTODashboard')
);
const VPEDashboard = lazy(
  () => import('../pages/dashboards/executive/VPEDashboard')
);
const EMDashboard = lazy(
  () => import('../pages/dashboards/executive/EMDashboard')
);
const TLDashboard = lazy(
  () => import('../pages/dashboards/engineering/TLDashboard')
);
const SEDashboard = lazy(
  () => import('../pages/dashboards/engineering/SEDashboard')
);
const SWEDashboard = lazy(
  () => import('../pages/dashboards/engineering/SWEDashboard')
);
const JREDashboard = lazy(
  () => import('../pages/dashboards/engineering/JREDashboard')
);
const InternDashboard = lazy(
  () => import('../pages/dashboards/engineering/InternDashboard')
);
const QADashboard = lazy(() => import('../pages/dashboards/qa/QADashboard'));
const SQADashboard = lazy(() => import('../pages/dashboards/qa/SQADashboard'));
const QALeadDashboard = lazy(
  () => import('../pages/dashboards/qa/QALeadDashboard')
);
const HRDashboard = lazy(
  () => import('../pages/dashboards/support/HRDashboard')
);
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const CreateTeam = lazy(() => import('../pages/teams/CreateTeam'));
const EditTeam = lazy(() => import('../pages/teams/EditTeam'));
const AdminBilling = lazy(() => import('../pages/admin/AdminBilling'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

export const publicRoutes = [
  { path: '/', component: Home, exact: true, title: 'Home' },
  { path: ROUTES.LOGIN, component: Login, title: 'Login' },
  { path: ROUTES.REGISTER, component: Register, title: 'Register' },
  {
    path: '/forgot-password',
    component: ForgotPassword,
    title: 'Forgot Password',
  },
  {
    path: '/reset-password/:token',
    component: ResetPassword,
    title: 'Reset Password',
  },
  { path: '/join', component: Join, title: 'Join Workspace' },
  { path: '/pricing', component: Pricing, title: 'Pricing Plans' },
];

export const privateRoutes = [
  // General Protected Routes
  { path: ROUTES.TEAMS, component: Team, title: 'Squad Management' },
  {
    path: '/team/project/:projectId',
    component: ProjectTeam,
    title: 'Project Squad',
  },
  {
    path: '/project-info',
    component: ProjectInfo,
    title: 'Project Information',
  },
  { path: ROUTES.DASHBOARD, component: Dashboard, title: 'General Dashboard' },
  {
    path: ROUTES.PERSONAL_WORK_CONSOLE,
    component: SWEDashboard,
    title: 'Personal Work Console',
  },
  {
    path: ROUTES.GUIDED_WORK_ASSISTANT,
    component: JREDashboard,
    title: 'Guided Work Assistant',
  },
  {
    path: ROUTES.LEARNING_WORKSPACE,
    component: InternDashboard,
    title: 'Learning Workspace',
  },
  { path: '/project/:id', component: ProjectDetail, title: 'Project Details' },
  {
    path: '/war-room/:projectId',
    component: ProjectWarRoom,
    title: 'Project War Room',
  },
  { path: '/task/:taskId', component: TaskDetail, title: 'Task Details' },
  {
    path: '/project/:id/settings',
    component: ProjectSettings,
    title: 'Project Settings',
  },
  { path: ROUTES.MY_TASKS, component: MyTasks, title: 'My Assigned Tasks' },
  { path: '/velocity', component: Velocity, title: 'Velocity Controller' },
  { path: ROUTES.PROFILE, component: Profile, title: 'Operative Profile' },
  { path: ROUTES.SETTINGS, component: Settings, title: 'System Settings' },
  { path: '/theme', component: Theme, title: 'Interface Customization' },

  // Permission-based Routes
  {
    path: '/team/add',
    component: AddTeamMember,
    permission: PERMISSIONS.INVITE_USERS,
    fallback: ROUTES.TEAMS,
    title: 'Invite Team Member',
  },
  {
    path: '/project-setup',
    component: ProjectSetup,
    permission: PERMISSIONS.CREATE_PROJECT,
    fallback: ROUTES.DASHBOARD,
    title: 'Create Project Workspace',
  },

  // Role-based Multi-Dashboards
  {
    path: ROUTES.COMMAND_CENTER,
    component: CTODashboard,
    roles: ['WORKSPACE_ADMIN'],
    titles: ['cto'],
    title: 'CTO Command Center',
  },
  {
    path: ROUTES.EXECUTION_COMMANDER,
    component: VPEDashboard,
    roles: ['WORKSPACE_ADMIN', 'VP_ENGINEERING', 'WORKSPACE_MANAGER'],
    titles: ['vp engineering'],
    title: 'VPE Execution Commander',
  },
  {
    path: ROUTES.TEAM_COMMAND_CENTER,
    component: EMDashboard,
    roles: ['ENGINEERING_MANAGER', 'WORKSPACE_ADMIN', 'TECH_LEAD'],
    titles: ['engineering manager'],
    title: 'EM Team Command Center',
  },
  {
    path: ROUTES.SYSTEM_HEALTH_CONTROL,
    component: TLDashboard,
    roles: ['TECH_LEAD', 'WORKSPACE_ADMIN', 'VP_ENGINEERING'],
    titles: ['tech lead'],
    title: 'TL System Health Control',
  },
  {
    path: ROUTES.EXECUTION_CONTROL,
    component: SEDashboard,
    roles: [
      'SENIOR_ENGINEER',
      'TECH_LEAD',
      'WORKSPACE_ADMIN',
      'VP_ENGINEERING',
      'ENGINEERING_MANAGER',
    ],
    titles: ['senior engineer'],
    title: 'SE Execution Control',
  },
  {
    path: ROUTES.QUALITY_CONTROL,
    component: QADashboard,
    roles: [
      'QA_ENGINEER',
      'TECH_LEAD',
      'ENGINEERING_MANAGER',
      'VP_ENGINEERING',
      'WORKSPACE_ADMIN',
    ],
    titles: ['qa engineer'],
    title: 'QA Quality Control',
  },
  {
    path: ROUTES.QUALITY_STRATEGY,
    component: SQADashboard,
    roles: [
      'QA_ENGINEER',
      'TECH_LEAD',
      'ENGINEERING_MANAGER',
      'VP_ENGINEERING',
      'WORKSPACE_ADMIN',
    ],
    titles: ['senior qa engineer'],
    title: 'SQA Quality Strategy',
  },
  {
    path: ROUTES.QUALITY_COMMAND,
    component: QALeadDashboard,
    roles: [
      'QA_ENGINEER',
      'TECH_LEAD',
      'ENGINEERING_MANAGER',
      'VP_ENGINEERING',
      'WORKSPACE_ADMIN',
    ],
    titles: ['qa lead'],
    title: 'QA Quality Command',
  },
  {
    path: ROUTES.HR,
    component: HRDashboard,
    roles: [
      'HR_MANAGER',
      'WORKSPACE_ADMIN',
      'VP_ENGINEERING',
      'ENGINEERING_MANAGER',
    ],
    titles: ['hr', 'hr manager'],
    title: 'HR Workforce Control',
  },
  {
    path: ROUTES.ADMIN_PANEL,
    component: AdminDashboard,
    roles: ['WORKSPACE_ADMIN'],
    title: 'Workspace Admin Panel',
  },
  {
    path: '/admin/teams/create',
    component: CreateTeam,
    roles: ['WORKSPACE_ADMIN'],
    title: 'Create Squad Unit',
  },
  {
    path: '/admin/teams/edit/:id',
    component: EditTeam,
    roles: ['WORKSPACE_ADMIN'],
    title: 'Edit Squad Unit',
  },
  {
    path: '/admin/billing',
    component: AdminBilling,
    roles: ['WORKSPACE_ADMIN', 'WORKSPACE_MANAGER'],
    title: 'Billing & Quota Settings',
  },
];
