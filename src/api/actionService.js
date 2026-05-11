import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

export const getPendingActions = () => {
  return apiClient.get(API_ENDPOINTS.ACTIONS.PENDING);
};

export const approveAction = (id) => {
  return apiClient.post(API_ENDPOINTS.ACTIONS.APPROVE(id));
};

export const rejectAction = (id) => {
  return apiClient.post(API_ENDPOINTS.ACTIONS.REJECT(id));
};

export default {
  getPendingActions,
  approveAction,
  rejectAction,
};

