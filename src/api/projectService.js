import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

// Service for managing project-related data and operations.
class ProjectService {
  // Fetch all projects that the current user has access to.
  getProjects() {
    return apiClient.get(API_ENDPOINTS.PROJECTS.BASE);
  }

  // Create a new project with the provided data.
  createProject(projectData) {
    return apiClient.post(API_ENDPOINTS.PROJECTS.BASE, projectData);
  }

  // Get detailed information for a specific project.
  getProject(projectId) {
    return apiClient.get(API_ENDPOINTS.PROJECTS.DETAIL(projectId));
  }

  // Get analytics for a project, with an optional sprint filter.
  getProjectAnalytics(projectId, sprintId = null) {
    const baseUrl = API_ENDPOINTS.PROJECTS.ANALYTICS(projectId);
    const url = sprintId ? `${baseUrl}?sprintId=${sprintId}` : baseUrl;
    return apiClient.get(url);
  }

  // Update the details of an existing project.
  updateProject(projectId, projectData) {
    return apiClient.patch(
      API_ENDPOINTS.PROJECTS.DETAIL(projectId),
      projectData
    );
  }
}

export default new ProjectService();
