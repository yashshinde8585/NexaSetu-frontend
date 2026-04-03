import api from './axios';
import { API_ENDPOINTS } from '../constants';

class ActionService {
  async getPendingActions() {
    const response = await api.get(API_ENDPOINTS.ACTIONS.PENDING);
    return response.data;
  }

  async approveAction(id) {
    const response = await api.post(API_ENDPOINTS.ACTIONS.APPROVE(id));
    return response.data;
  }

  async rejectAction(id) {
    const response = await api.post(API_ENDPOINTS.ACTIONS.REJECT(id));
    return response.data;
  }
}

export default new ActionService();
