import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

export const createTask = (taskData) => {
  return apiClient.post(API_ENDPOINTS.TASKS.BASE, taskData);
};
export const getTasksByProject = (projectId, sprintId = null) => {
  const baseUrl = API_ENDPOINTS.TASKS.BY_PROJECT(projectId);
  const url = sprintId ? `${baseUrl}?sprintId=${sprintId}` : baseUrl;
  return apiClient.get(url);
};
export const getMyTasks = (scope = 'personal') => {
  return apiClient.get(`${API_ENDPOINTS.TASKS.MY_TASKS}?scope=${scope}`);
};
export const updateTaskStatus = (taskId, status, version) => {
  return apiClient.patch(`${API_ENDPOINTS.TASKS.DETAIL(taskId)}/status`, { status, version });
};
export const updateTask = (taskId, taskData) => {
  return apiClient.patch(API_ENDPOINTS.TASKS.DETAIL(taskId), taskData);
};
export const getTaskById = (taskId) => {
  return apiClient.get(API_ENDPOINTS.TASKS.DETAIL(taskId));
};

export const toggleTaskBlockage = (taskId, blocked, reason = '') => {
  return apiClient.patch(`${API_ENDPOINTS.TASKS.DETAIL(taskId)}/block`, { 
    taskId, 
    blocked, 
    reason 
  });
};
export const updateTaskSteps = (taskId, steps) => {
  return apiClient.patch(`${API_ENDPOINTS.TASKS.DETAIL(taskId)}/steps`, { steps });
};

export const submitTaskReview = (taskId, result, notes) => {
  return apiClient.post(`${API_ENDPOINTS.TASKS.DETAIL(taskId)}/review`, { result, notes });
};

export default {
  createTask,
  getTasksByProject,
  getMyTasks,
  updateTaskStatus,
  updateTask,
  getTaskById,
  toggleTaskBlockage,
  updateTaskSteps,
  submitTaskReview,
};

