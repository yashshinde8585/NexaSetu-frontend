import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

export const getDashboardStats = (params = {}) => {
  return apiClient.get(API_ENDPOINTS.DASHBOARD.STATS, { params });
};

export const getRoleDashboard = (role) => {
  const r = role.toLowerCase();

  if (
    ['em', 'vpe', 'cto', 'tl', 'tech_lead', 'engineering_manager'].includes(r)
  ) {
    return apiClient.get(API_ENDPOINTS.DASHBOARDS.MANAGEMENT, {
      params: { view: r },
    });
  }

  if (['qa', 'sqa', 'qa_lead', 'hr'].includes(r)) {
    return apiClient.get(API_ENDPOINTS.DASHBOARDS.OPERATIONS, {
      params: { view: r },
    });
  }

  return apiClient.get(API_ENDPOINTS.DASHBOARDS.TACTICAL(r));
};

export const getRoleBreakdown = (category) => {
  return apiClient.get(API_ENDPOINTS.CTO.FUNCTION_DRILLDOWN(category));
};

export const getIndividualBreakdown = (role) => {
  return apiClient.get(API_ENDPOINTS.CTO.INDIVIDUAL_DRILLDOWN(role));
};

export const recalculateDashboard = (role) => {
  return apiClient.post(
    '/leadership/recalculate',
    {},
    { params: { view: role } }
  );
};

export default {
  getDashboardStats,
  getRoleDashboard,
  getRoleBreakdown,
  getIndividualBreakdown,
  recalculateDashboard,
};
