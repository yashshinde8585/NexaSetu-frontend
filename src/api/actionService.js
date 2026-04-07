import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

class ActionService {
  getPendingActions() {
    return apiClient.get(API_ENDPOINTS.ACTIONS.PENDING);
  }

  approveAction(id) {
    return apiClient.post(API_ENDPOINTS.ACTIONS.APPROVE(id));
  }

  rejectAction(id) {
    return apiClient.post(API_ENDPOINTS.ACTIONS.REJECT(id));
  }
}

export default new ActionService();
