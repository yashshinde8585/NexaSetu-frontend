import api from './axios';
import { API_ENDPOINTS } from '../constants';

class ResourceService {
  async getWorkload() {
    const response = await api.get(API_ENDPOINTS.RESOURCES.WORKLOAD);
    return response.data;
  }
}

export default new ResourceService();
