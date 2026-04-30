import React, { lazy } from 'react';
import { ROUTES } from '../constants';
import { PERMISSIONS } from '../hooks/usePermissions';

// Pages
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Home = lazy(() => import('../pages/Home'));
const Join = lazy(() => import('../pages/Join'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ProjectDetail = lazy(() => import('../pages/ProjectDetail'));
const ProjectWarRoom = lazy(() => import('../pages/ProjectWarRoom'));
const Pricing = lazy(() => import('../pages/Pricing'));
const Team = lazy(() => import('../pages/Team'));
const ProjectTeam = lazy(() => import('../pages/ProjectTeam'));
const AddTeamMember = lazy(() => import('../pages/AddTeamMember'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Theme = lazy(() => import('../pages/Theme'));
const ProjectInfo = lazy(() => import('../pages/ProjectInfo'));
const ProjectSetup = lazy(() => import('../pages/ProjectSetup'));
const ProjectSettings = lazy(() => import('../pages/ProjectSettings'));
const MyTasks = lazy(() => import('../pages/MyTasks'));
const Velocity = lazy(() => import('../pages/Velocity'));
const TaskDetail = lazy(() => import('../pages/TaskDetail'));
const CTODashboard = lazy(() => import('../pages/CTODashboard'));
const VPEDashboard = lazy(() => import('../pages/VPEDashboard'));
const EMDashboard = lazy(() => import('../pages/EMDashboard'));
const TLDashboard = lazy(() => import('../pages/TLDashboard'));
const SEDashboard = lazy(() => import('../pages/SEDashboard'));
const SWEDashboard = lazy(() => import('../pages/SWEDashboard'));
const JREDashboard = lazy(() => import('../pages/JREDashboard'));
const InternDashboard = lazy(() => import('../pages/InternDashboard'));
const QADashboard = lazy(() => import('../pages/QADashboard'));
const SQADashboard = lazy(() => import('../pages/SQADashboard'));
const QALeadDashboard = lazy(() => import('../pages/QALeadDashboard'));
const HRDashboard = lazy(() => import('../pages/HRDashboard'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const CreateTeam = lazy(() => import('../pages/CreateTeam'));
const EditTeam = lazy(() => import('../pages/EditTeam'));
const AdminBilling = lazy(() => import('../pages/AdminBilling'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));

export const publicRoutes = [
  { path: '/', component: Home, exact: true },
  { path: ROUTES.LOGIN, component: Login },
  { path: ROUTES.REGISTER, component: Register },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/reset-password/:token', component: ResetPassword },
  { path: '/join', component: Join },
  { path: '/pricing', component: Pricing },
];

export const privateRoutes = [
  // General Protected Routes
  { path: ROUTES.TEAMS, component: Team },
  { path: '/team/project/:projectId', component: ProjectTeam },
  { path: '/project-info', component: ProjectInfo },
  { path: ROUTES.DASHBOARD, component: Dashboard },
  { path: ROUTES.PERSONAL_WORK_CONSOLE, component: SWEDashboard },
  { path: ROUTES.GUIDED_WORK_ASSISTANT, component: JREDashboard },
  { path: ROUTES.LEARNING_WORKSPACE, component: InternDashboard },
  { path: '/project/:id', component: ProjectDetail },
  { path: '/war-room/:projectId', component: ProjectWarRoom },
  { path: '/task/:taskId', component: TaskDetail },
  { path: '/project/:id/settings', component: ProjectSettings },
  { path: ROUTES.MY_TASKS, component: MyTasks },
  { path: '/velocity', component: Velocity },
  { path: ROUTES.PROFILE, component: Profile },
  { path: ROUTES.SETTINGS, component: Settings },
  { path: '/theme', component: Theme },

  // Permission-based Routes
  { 
    path: '/team/add', 
    component: AddTeamMember, 
    permission: PERMISSIONS.INVITE_USERS,
    fallback: ROUTES.TEAMS 
  },
  { 
    path: '/project-setup', 
    component: ProjectSetup, 
    permission: PERMISSIONS.CREATE_PROJECT,
    fallback: ROUTES.DASHBOARD 
  },

  // Role-based Multi-Dashboards
  { 
    path: ROUTES.COMMAND_CENTER, 
    component: CTODashboard, 
    roles: ['WORKSPACE_ADMIN'],
    titles: ['cto']
  },
  { 
    path: ROUTES.EXECUTION_COMMANDER, 
    component: VPEDashboard, 
    roles: ['WORKSPACE_ADMIN', 'VP_ENGINEERING', 'WORKSPACE_MANAGER'],
    titles: ['vp engineering']
  },
  { 
    path: ROUTES.TEAM_COMMAND_CENTER, 
    component: EMDashboard, 
    roles: ['ENGINEERING_MANAGER', 'WORKSPACE_ADMIN', 'TECH_LEAD'],
    titles: ['engineering manager']
  },
  { 
    path: ROUTES.SYSTEM_HEALTH_CONTROL, 
    component: TLDashboard, 
    roles: ['TECH_LEAD', 'WORKSPACE_ADMIN', 'VP_ENGINEERING'],
    titles: ['tech lead']
  },
  { 
    path: ROUTES.EXECUTION_CONTROL, 
    component: SEDashboard, 
    roles: ['SENIOR_ENGINEER', 'TECH_LEAD', 'WORKSPACE_ADMIN', 'VP_ENGINEERING', 'ENGINEERING_MANAGER'],
    titles: ['senior engineer']
  },
  { 
    path: ROUTES.QUALITY_CONTROL, 
    component: QADashboard, 
    roles: ['QA_ENGINEER', 'TECH_LEAD', 'ENGINEERING_MANAGER', 'VP_ENGINEERING', 'WORKSPACE_ADMIN'],
    titles: ['qa engineer']
  },
  { 
    path: ROUTES.QUALITY_STRATEGY, 
    component: SQADashboard, 
    roles: ['QA_ENGINEER', 'TECH_LEAD', 'ENGINEERING_MANAGER', 'VP_ENGINEERING', 'WORKSPACE_ADMIN'],
    titles: ['senior qa engineer']
  },
  { 
    path: ROUTES.QUALITY_COMMAND, 
    component: QALeadDashboard, 
    roles: ['QA_ENGINEER', 'TECH_LEAD', 'ENGINEERING_MANAGER', 'VP_ENGINEERING', 'WORKSPACE_ADMIN'],
    titles: ['qa lead']
  },
  { 
    path: ROUTES.HR, 
    component: HRDashboard, 
    roles: ['HR_MANAGER', 'WORKSPACE_ADMIN', 'VP_ENGINEERING', 'ENGINEERING_MANAGER'],
    titles: ['hr', 'hr manager']
  },
  { 
    path: ROUTES.ADMIN_PANEL, 
    component: AdminDashboard, 
    roles: ['WORKSPACE_ADMIN'] 
  },
  { 
    path: '/admin/teams/create', 
    component: CreateTeam, 
    roles: ['WORKSPACE_ADMIN'] 
  },
  { 
    path: '/admin/teams/edit/:id', 
    component: EditTeam, 
    roles: ['WORKSPACE_ADMIN'] 
  },
  { 
    path: '/admin/billing', 
    component: AdminBilling, 
    roles: ['WORKSPACE_ADMIN', 'WORKSPACE_MANAGER'] 
  },
];
