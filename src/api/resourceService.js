import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

class ResourceService {
  getWorkload() {
    return apiClient.get(API_ENDPOINTS.RESOURCES.WORKLOAD);
  }
}

export default new ResourceService();
