import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

export const trackEvent = (eventType, payload = {}) => {
  return apiClient.post(API_ENDPOINTS.METRICS.EVENT, { eventType, payload });
};

export const trackSignup = (workspaceName, plan) => {
  return trackEvent('signup', { workspaceName, plan });
};

export const trackProjectCreated = (projectId, name) => {
  return trackEvent('project_created', { projectId, name });
};

export const trackTaskCreated = (taskId, title) => {
  return trackEvent('task_created', { taskId, title });
};

export default {
  trackEvent,
  trackSignup,
  trackProjectCreated,
  trackTaskCreated,
};

