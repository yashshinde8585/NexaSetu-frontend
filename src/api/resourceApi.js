import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

export const getWorkload = () => {
  return apiClient.get(API_ENDPOINTS.RESOURCES.WORKLOAD);
};

export default {
  getWorkload,
};
