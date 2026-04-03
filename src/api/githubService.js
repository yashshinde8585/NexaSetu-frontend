import api from './axios';
import { API_ENDPOINTS } from '../constants';

// Service for managing GitHub integration and repository connections.
class GithubService {
  // Connect a GitHub account using an access token.
  async connectGithub(accessToken) {
    const response = await api.post(API_ENDPOINTS.GITHUB.CONNECT, {
      accessToken,
    });
    return response.data;
  }

  // List all repositories for the connected GitHub account.
  async getRepositories() {
    const response = await api.get(API_ENDPOINTS.GITHUB.REPOSITORIES);
    return response.data;
  }

  // Link a GitHub repository to a specific project.
  async linkProject(projectId, repoInfo) {
    const response = await api.post(API_ENDPOINTS.GITHUB.LINK_PROJECT, {
      projectId,
      repoInfo,
    });
    return response.data;
  }

  // Get task suggestions based on recent commit activity.
  async getActivitySuggestions(projectId) {
    const response = await api.get(API_ENDPOINTS.GITHUB.SUGGESTIONS(projectId));
    return response.data;
  }

  // Import and approve the suggested tasks for a project.
  async approveTasks(projectId, tasks) {
    const response = await api.post(API_ENDPOINTS.GITHUB.APPROVE_TASKS, {
      projectId,
      tasks,
    });
    return response.data;
  }
}

export default new GithubService();
