import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

export const executeCommand = (command, context = {}) => {
  return apiClient.post(API_ENDPOINTS.MAGIC.EXECUTE, {
    command,
    context,
  });
};

export default {
  executeCommand,
};
