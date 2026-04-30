import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

class DashboardService {
  /**
   * Fetch generic dashboard stats
   */
  getDashboardStats(params = {}) {
    return apiClient.get(API_ENDPOINTS.DASHBOARD.STATS, { params });
  }

  /**
   * Fetch role-specific tactical dashboard data
   * @param {string} role - The role slug (e.g., 'em', 'se', 'swe', 'intern')
   */
  getRoleDashboard(role) {
    const r = role.toLowerCase();
    
    // Management roles
    if (['em', 'vpe', 'cto', 'tl', 'tech_lead', 'engineering_manager'].includes(r)) {
      return apiClient.get(API_ENDPOINTS.DASHBOARDS.MANAGEMENT, { params: { view: r } });
    }
    
    // Operations roles
    if (['qa', 'sqa', 'qa_lead', 'hr'].includes(r)) {
      return apiClient.get(API_ENDPOINTS.DASHBOARDS.OPERATIONS);
    }
    
    // Default to Engineering Workspace for ICs (SWE, SE, Intern, JRE)
    return apiClient.get(API_ENDPOINTS.DASHBOARDS.TACTICAL(r));
  }

  /**
   * Fetch functional role breakdown for drilldown
   */
  getRoleBreakdown(category) {
    return apiClient.get(API_ENDPOINTS.CTO.FUNCTION_DRILLDOWN(category));
  }

  /**
   * Fetch individual breakdown for a specific role
   */
  getIndividualBreakdown(role) {
    return apiClient.get(API_ENDPOINTS.CTO.INDIVIDUAL_DRILLDOWN(role));
  }

  /**
   * Manually trigger dashboard data recalculation
   */
  recalculateDashboard(role) {
    return apiClient.post('/leadership/recalculate', {}, { params: { view: role } });
  }

}

export default new DashboardService();
