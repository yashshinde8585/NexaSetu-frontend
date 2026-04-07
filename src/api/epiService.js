import apiClient from './apiClient';

/**
 * Project Intelligence API Service
 */

const getSprintEPI = async (sprintId) => {
  const response = await apiClient.get(`/epi/sprint/${sprintId}`);
  return response.data;
};

const getNarrativeReport = async (sprintId, type = 'EXECUTIVE') => {
  const response = await apiClient.get(`/epi/report/${sprintId}?type=${type}`);
  return response.data;
};

const getTaskEPI = async (taskId) => {
  const response = await apiClient.get(`/epi/task/${taskId}`);
  return response.data;
};

const getTaskHelp = async (taskId) => {
  const response = await apiClient.get(`/epi/help/${taskId}`);
  return response.data;
};

const executeEPIAction = async (actionType, metadata) => {
  const response = await apiClient.post('/epi/execute-action', { actionType, metadata });
  return response.data;
};

export default {
  getSprintEPI,
  getTaskEPI,
  getTaskHelp,
  getNarrativeReport,
  executeEPIAction,
};
