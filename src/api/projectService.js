import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

export const getProjects = () => {
  return apiClient.get(API_ENDPOINTS.PROJECTS.BASE);
};
export const createProject = (projectData) => {
  return apiClient.post(API_ENDPOINTS.PROJECTS.BASE, projectData);
};

export const getProject = (projectId) => {
  return apiClient.get(API_ENDPOINTS.PROJECTS.DETAIL(projectId));
};
export const getProjectAnalytics = (projectId, sprintId = null) => {
  const baseUrl = API_ENDPOINTS.PROJECTS.ANALYTICS(projectId);
  const url = sprintId ? `${baseUrl}?sprintId=${sprintId}` : baseUrl;
  return apiClient.get(url);
};

export const updateProject = (projectId, projectData) => {
  return apiClient.patch(
    API_ENDPOINTS.PROJECTS.DETAIL(projectId),
    projectData
  );
};

export default {
  getProjects,
  createProject,
  getProject,
  getProjectAnalytics,
  updateProject,
};

