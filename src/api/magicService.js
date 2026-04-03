import api from './axios';
import { API_ENDPOINTS } from '../constants';

class MagicService {
  async executeCommand(command, context = {}) {
    const response = await api.post(API_ENDPOINTS.MAGIC.EXECUTE, {
      command,
      context,
    });
    return response.data;
  }
}

export default new MagicService();
