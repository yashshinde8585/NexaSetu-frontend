import api from './axios';
import { API_ENDPOINTS } from '../constants';

// Service for managing project-related data and operations.
class ProjectService {
  // Fetch all projects that the current user has access to.
  async getProjects() {
    const response = await api.get(API_ENDPOINTS.PROJECTS.BASE);
    return response.data;
  }

  // Create a new project with the provided data.
  async createProject(projectData) {
    const response = await api.post(API_ENDPOINTS.PROJECTS.BASE, projectData);
    return response.data;
  }

  // Get detailed information for a specific project.
  async getProject(projectId) {
    const response = await api.get(API_ENDPOINTS.PROJECTS.DETAIL(projectId));
    return response.data;
  }

  // Get analytics for a project, with an optional sprint filter.
  async getProjectAnalytics(projectId, sprintId = null) {
    const baseUrl = API_ENDPOINTS.PROJECTS.ANALYTICS(projectId);
    const url = sprintId ? `${baseUrl}?sprintId=${sprintId}` : baseUrl;
    const response = await api.get(url);
    return response.data;
  }

  // Update the details of an existing project.
  async updateProject(projectId, projectData) {
    const response = await api.patch(
      API_ENDPOINTS.PROJECTS.DETAIL(projectId),
      projectData
    );
    return response.data;
  }
}

export default new ProjectService();
