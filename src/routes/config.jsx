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
const PeopleOpsDashboard = lazy(() => import('../pages/PeopleOpsDashboard'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const CreateTeam = lazy(() => import('../pages/CreateTeam'));
const EditTeam = lazy(() => import('../pages/EditTeam'));
const AdminBilling = lazy(() => import('../pages/AdminBilling'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));

export const publicRoutes = [
  { path: '/', element: <Home />, exact: true },
  { path: ROUTES.LOGIN, element: <Login /> },
  { path: ROUTES.REGISTER, element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password/:token', element: <ResetPassword /> },
  { path: '/join', element: <Join /> },
  { path: '/pricing', element: <Pricing /> },
];

export const privateRoutes = [
  // General Protected Routes
  { path: ROUTES.TEAMS, element: <Team /> },
  { path: '/team/project/:projectId', element: <ProjectTeam /> },
  { path: '/project-info', element: <ProjectInfo /> },
  { path: ROUTES.DASHBOARD, element: <Dashboard /> },
  { path: ROUTES.PERSONAL_WORK_CONSOLE, element: <SWEDashboard /> },
  { path: ROUTES.GUIDED_WORK_ASSISTANT, element: <JREDashboard /> },
  { path: ROUTES.LEARNING_WORKSPACE, element: <InternDashboard /> },
  { path: '/project/:id', element: <ProjectDetail /> },
  { path: '/task/:taskId', element: <TaskDetail /> },
  { path: '/project/:id/settings', element: <ProjectSettings /> },
  { path: ROUTES.MY_TASKS, element: <MyTasks /> },
  { path: '/velocity', element: <Velocity /> },
  { path: ROUTES.PROFILE, element: <Profile /> },
  { path: ROUTES.SETTINGS, element: <Settings /> },
  { path: '/theme', element: <Theme /> },

  // Permission-based Routes
  { 
    path: '/team/add', 
    element: <AddTeamMember />, 
    permission: PERMISSIONS.INVITE_USERS,
    fallback: ROUTES.TEAMS 
  },
  { 
    path: '/project-setup', 
    element: <ProjectSetup />, 
    permission: PERMISSIONS.CREATE_PROJECT,
    fallback: ROUTES.DASHBOARD 
  },

  // Role-based Multi-Dashboards
  { 
    path: ROUTES.COMMAND_CENTER, 
    element: <CTODashboard />, 
    roles: ['WORKSPACE_ADMIN'],
    titles: ['cto']
  },
  { 
    path: ROUTES.EXECUTION_COMMANDER, 
    element: <VPEDashboard />, 
    roles: ['WORKSPACE_ADMIN', 'VP_ENGINEERING', 'WORKSPACE_MANAGER'],
    titles: ['vp engineering']
  },
  { 
    path: ROUTES.TEAM_COMMAND_CENTER, 
    element: <EMDashboard />, 
    roles: ['ENGINEERING_MANAGER', 'WORKSPACE_ADMIN', 'TECH_LEAD'],
    titles: ['engineering manager']
  },
  { 
    path: ROUTES.SYSTEM_HEALTH_CONTROL, 
    element: <TLDashboard />, 
    roles: ['TECH_LEAD', 'WORKSPACE_ADMIN', 'VP_ENGINEERING'],
    titles: ['tech lead']
  },
  { 
    path: ROUTES.EXECUTION_CONTROL, 
    element: <SEDashboard />, 
    roles: ['SENIOR_ENGINEER', 'TECH_LEAD', 'WORKSPACE_ADMIN', 'VP_ENGINEERING', 'ENGINEERING_MANAGER'],
    titles: ['senior engineer']
  },
  { 
    path: ROUTES.QUALITY_CONTROL, 
    element: <QADashboard />, 
    roles: ['QA_ENGINEER', 'TECH_LEAD', 'ENGINEERING_MANAGER', 'VP_ENGINEERING', 'WORKSPACE_ADMIN'],
    titles: ['qa engineer']
  },
  { 
    path: ROUTES.QUALITY_STRATEGY, 
    element: <SQADashboard />, 
    roles: ['QA_ENGINEER', 'TECH_LEAD', 'ENGINEERING_MANAGER', 'VP_ENGINEERING', 'WORKSPACE_ADMIN'],
    titles: ['senior qa engineer']
  },
  { 
    path: ROUTES.QUALITY_COMMAND, 
    element: <QALeadDashboard />, 
    roles: ['QA_ENGINEER', 'TECH_LEAD', 'ENGINEERING_MANAGER', 'VP_ENGINEERING', 'WORKSPACE_ADMIN'],
    titles: ['qa lead']
  },
  { 
    path: ROUTES.PEOPLE_OPS, 
    element: <PeopleOpsDashboard />, 
    roles: ['HR_MANAGER', 'WORKSPACE_ADMIN', 'VP_ENGINEERING', 'ENGINEERING_MANAGER'],
    titles: ['people ops', 'hr manager']
  },
  { 
    path: ROUTES.ADMIN_PANEL, 
    element: <AdminDashboard />, 
    roles: ['WORKSPACE_ADMIN'] 
  },
  { 
    path: '/admin/teams/create', 
    element: <CreateTeam />, 
    roles: ['WORKSPACE_ADMIN'] 
  },
  { 
    path: '/admin/teams/edit/:id', 
    element: <EditTeam />, 
    roles: ['WORKSPACE_ADMIN'] 
  },
  { 
    path: '/admin/billing', 
    element: <AdminBilling />, 
    roles: ['WORKSPACE_ADMIN', 'WORKSPACE_MANAGER'] 
  },
];
