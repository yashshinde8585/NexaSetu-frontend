import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

class MagicService {
  executeCommand(command, context = {}) {
    return apiClient.post(API_ENDPOINTS.MAGIC.EXECUTE, {
      command,
      context,
    });
  }
}

export default new MagicService();
