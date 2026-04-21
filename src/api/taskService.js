import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

// Service to handle all API operations relating to task management.
class TaskService {
  // Create a new project task with the provided data.
  createTask(taskData) {
    return apiClient.post(API_ENDPOINTS.TASKS.BASE, taskData);
  }

  // Get tasks for a project, with an optional sprint filter.
  getTasksByProject(projectId, sprintId = null) {
    const baseUrl = API_ENDPOINTS.TASKS.BY_PROJECT(projectId);
    const url = sprintId ? `${baseUrl}?sprintId=${sprintId}` : baseUrl;
    return apiClient.get(url);
  }

  // Fetch all tasks assigned to the current user.
  getMyTasks(scope = 'personal') {
    return apiClient.get(`${API_ENDPOINTS.TASKS.MY_TASKS}?scope=${scope}`);
  }

  // Update the status of a specific task.
  updateTaskStatus(taskId, status, version) {
    return apiClient.patch(`${API_ENDPOINTS.TASKS.DETAIL(taskId)}/status`, { status, version });
  }

  // Update one or more fields for a specific task.
  updateTask(taskId, taskData) {
    return apiClient.patch(API_ENDPOINTS.TASKS.DETAIL(taskId), taskData);
  }

  // Fetch the full details of a single task by its ID.
  getTaskById(taskId) {
    return apiClient.get(API_ENDPOINTS.TASKS.DETAIL(taskId));
  }

  // Toggle mission blockage status.
  toggleTaskBlockage(taskId, blocked, reason = '') {
    return apiClient.patch(`${API_ENDPOINTS.TASKS.DETAIL(taskId)}/block`, { 
      taskId, 
      blocked, 
      reason 
    });
  }
}

export default new TaskService();
