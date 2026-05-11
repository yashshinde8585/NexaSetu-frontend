import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

export const getSprints = (projectId, config = {}) => {
  return apiClient.get(API_ENDPOINTS.SPRINTS.BASE, {
    ...config,
    params: {
      ...(config.params || {}),
      ...(projectId ? { project: projectId } : {})
    }
  });
};

export const createSprint = (data, config = {}) => {
  return apiClient.post(API_ENDPOINTS.SPRINTS.BASE, data, config);
};

export const syncHealth = (id, config = {}) => {
  return apiClient.post(`/sprints/${id}/sync`, null, config);
};

export const getSprintStats = (id, config = {}) => {
  return apiClient.get(API_ENDPOINTS.SPRINTS.STATS(id), config);
};

export const finalizeSprint = (id, config = {}) => {
  return apiClient.get(API_ENDPOINTS.SPRINTS.FINALIZE(id), config);
};

export const getSprintReport = (id, config = {}) => {
  return apiClient.get(API_ENDPOINTS.SPRINTS.REPORT(id), config);
};

export const updateSprint = (id, data, config = {}) => {
  return apiClient.patch(API_ENDPOINTS.SPRINTS.DETAIL(id), data, config);
};

export const deleteSprint = (id, config = {}) => {
  return apiClient.delete(API_ENDPOINTS.SPRINTS.DETAIL(id), config);
};

export default {
  getSprints,
  createSprint,
  syncHealth,
  getSprintStats,
  finalizeSprint,
  getSprintReport,
  updateSprint,
  deleteSprint,
};

