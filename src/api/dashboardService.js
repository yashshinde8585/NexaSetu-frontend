import api from './axios';
import { API_ENDPOINTS } from '../constants';

class DashboardService {
  async getDashboardStats(params = {}) {
    const response = await api.get(API_ENDPOINTS.DASHBOARD.STATS, { params });
    return response.data;
  }
}

export default new DashboardService();
