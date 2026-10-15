import React, { lazy } from 'react';

// Lazy load role dashboards for better bundle splitting
const CTODashboard = lazy(() => import('./executive/CTODashboard'));
const VPEDashboard = lazy(() => import('./executive/VPEDashboard'));
const EMDashboard = lazy(() => import('./executive/EMDashboard'));
const TLDashboard = lazy(() => import('./engineering/TLDashboard'));
const QADashboard = lazy(() => import('./qa/QADashboard'));
const SQADashboard = lazy(() => import('./qa/SQADashboard'));
const QALeadDashboard = lazy(() => import('./qa/QALeadDashboard'));
const HRDashboard = lazy(() => import('./support/HRDashboard'));
const SEDashboard = lazy(() => import('./engineering/SEDashboard'));
const SWEDashboard = lazy(() => import('./engineering/SWEDashboard'));
const JREDashboard = lazy(() => import('./engineering/JREDashboard'));
const InternDashboard = lazy(() => import('./engineering/InternDashboard'));

/**
 * Registry mapping user attributes (role/title) to dashboard components.
 */
export const DASHBOARD_REGISTRY = [
  {
    id: 'cto',
    match: (role, title) => title.includes('cto'),
    component: CTODashboard,
  },
  {
    id: 'vpe',
    match: (role, title) => title.includes('vp engineering'),
    component: VPEDashboard,
  },
  {
    id: 'em',
    match: (role, title) =>
      role === 'ENGINEERING_MANAGER' || title.includes('engineering manager'),
    component: EMDashboard,
  },
  {
    id: 'tl',
    match: (role, title) => role === 'TECH_LEAD' || title.includes('tech lead'),
    component: TLDashboard,
  },
  {
    id: 'qa_lead',
    match: (role, title) => title.includes('qa lead'),
    component: QALeadDashboard,
  },
  {
    id: 'hr',
    match: (role, title) =>
      role === 'HR_MANAGER' ||
      title.includes('hr') ||
      title.includes('hr manager'),
    component: HRDashboard,
  },
  {
    id: 'sqa',
    match: (role, title) => title.includes('senior qa engineer'),
    component: SQADashboard,
  },
  {
    id: 'qa',
    match: (role, title) =>
      role === 'QA_ENGINEER' || title.includes('qa engineer'),
    component: QADashboard,
  },
  {
    id: 'senior_eng',
    match: (role, title) =>
      role === 'SENIOR_ENGINEER' || title.includes('senior engineer'),
    component: SEDashboard,
  },
  {
    id: 'swe',
    match: (role, title) =>
      role === 'SOFTWARE_ENGINEER' || title.includes('software engineer'),
    component: SWEDashboard,
  },
  {
    id: 'junior_eng',
    match: (role, title) =>
      role === 'JUNIOR_ENGINEER' || title.includes('junior engineer'),
    component: JREDashboard,
  },
  {
    id: 'intern',
    match: (role, title) => role === 'INTERN' || title.includes('intern'),
    component: InternDashboard,
  },
];

/**
 * Resolves the appropriate dashboard component based on user context.
 */
export const resolveDashboard = (user) => {
  if (!user) return null;
  const role = user.role || '';
  const title = (user.jobTitle || '').toLowerCase();

  const entry = DASHBOARD_REGISTRY.find((d) => d.match(role, title));
  return entry ? entry.component : null;
};
