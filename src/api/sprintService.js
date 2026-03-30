import api from './axios';

const API_URL = '/sprints';

export const getSprints = () => api.get(API_URL);
export const createSprint = (data) => api.post(API_URL, data);
export const getSprintStats = (id) => api.get(`${API_URL}/${id}/stats`);
export const finalizeSprint = (id) => api.get(`${API_URL}/${id}/finalize`);
export const updateSprint = (id, data) => api.patch(`${API_URL}/${id}`, data);
export const deleteSprint = (id) => api.delete(`${API_URL}/${id}`);
