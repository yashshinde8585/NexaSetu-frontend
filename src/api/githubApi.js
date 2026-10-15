import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

export const connectGithub = (accessToken) => {
  return apiClient.post(API_ENDPOINTS.GITHUB.CONNECT, { accessToken });
};
export const getRepositories = () => {
  return apiClient.get(API_ENDPOINTS.GITHUB.REPOSITORIES);
};
export const linkProject = (projectId, repoInfo) => {
  return apiClient.post(API_ENDPOINTS.GITHUB.LINK_PROJECT, {
    projectId,
    repoInfo,
  });
};
export const getActivitySuggestions = (projectId) => {
  return apiClient.get(API_ENDPOINTS.GITHUB.SUGGESTIONS(projectId));
};
export const approveTasks = (projectId, tasks) => {
  return apiClient.post(API_ENDPOINTS.GITHUB.APPROVE_TASKS, {
    projectId,
    tasks,
  });
};

export default {
  connectGithub,
  getRepositories,
  linkProject,
  getActivitySuggestions,
  approveTasks,
};
