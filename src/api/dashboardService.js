import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

class DashboardService {
  getDashboardStats(params = {}) {
    return apiClient.get(API_ENDPOINTS.DASHBOARD.STATS, { params });
  }
}

export default new DashboardService();
