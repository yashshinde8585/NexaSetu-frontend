import apiClient from './apiClient';

// Handles management of mission-critical task discussions and system-generated activity logs.
export const getTaskComments = (taskId) => {
  return apiClient.get(`/comments/task/${taskId}`);
};

export const addComment = (taskId, content) => {
  return apiClient.post(`/comments/task/${taskId}`, { content });
};

export default {
  getTaskComments,
  addComment,
};
