import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

export const getSprints = (projectId) => {
  return apiClient.get(API_ENDPOINTS.SPRINTS.BASE, {
    params: projectId ? { project: projectId } : {}
  });
};

export const createSprint = (data) => {
  return apiClient.post(API_ENDPOINTS.SPRINTS.BASE, data);
};

export const syncHealth = (id) => {
  return apiClient.post(`/sprints/${id}/sync`);
};

export const getSprintStats = (id) => {
  return apiClient.get(API_ENDPOINTS.SPRINTS.STATS(id));
};

export const finalizeSprint = (id) => {
  return apiClient.get(API_ENDPOINTS.SPRINTS.FINALIZE(id));
};

export const getSprintReport = (id) => {
  return apiClient.get(API_ENDPOINTS.SPRINTS.REPORT(id));
};

export const updateSprint = (id, data) => {
  return apiClient.patch(API_ENDPOINTS.SPRINTS.DETAIL(id), data);
};

export const deleteSprint = (id) => {
  return apiClient.delete(API_ENDPOINTS.SPRINTS.DETAIL(id));
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

