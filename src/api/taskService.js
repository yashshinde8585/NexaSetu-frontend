import api from './axios';
import { API_ENDPOINTS } from '../constants';

// Service to handle all API operations relating to task management.
class TaskService {
  // Create a new project task with the provided data.
  async createTask(taskData) {
    const response = await api.post(API_ENDPOINTS.TASKS.BASE, taskData);
    return response.data;
  }

  // Get tasks for a project, with an optional sprint filter.
  async getTasksByProject(projectId, sprintId = null) {
    const baseUrl = API_ENDPOINTS.TASKS.BY_PROJECT(projectId);
    const url = sprintId ? `${baseUrl}?sprintId=${sprintId}` : baseUrl;
    const response = await api.get(url);
    return response.data;
  }

  // Fetch all tasks assigned to the current user.
  async getMyTasks(scope = 'personal') {
    const response = await api.get(
      `${API_ENDPOINTS.TASKS.MY_TASKS}?scope=${scope}`
    );
    return response.data;
  }

  // Update the status of a specific task.
  async updateTaskStatus(taskId, status) {
    const response = await api.patch(API_ENDPOINTS.TASKS.DETAIL(taskId), {
      status,
    });
    return response.data;
  }

  // Update one or more fields for a specific task.
  async updateTask(taskId, taskData) {
    const response = await api.patch(
      API_ENDPOINTS.TASKS.DETAIL(taskId),
      taskData
    );
    return response.data;
  }

  // Fetch the full details of a single task by its ID.
  async getTaskById(taskId) {
    const response = await api.get(API_ENDPOINTS.TASKS.DETAIL(taskId));
    return response.data;
  }
}

export default new TaskService();
