import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

// Service for managing GitHub integration and repository connections.
class GithubService {
  // Connect a GitHub account using an access token.
  connectGithub(accessToken) {
    return apiClient.post(API_ENDPOINTS.GITHUB.CONNECT, { accessToken });
  }

  // List all repositories for the connected GitHub account.
  getRepositories() {
    return apiClient.get(API_ENDPOINTS.GITHUB.REPOSITORIES);
  }

  // Link a GitHub repository to a specific project.
  linkProject(projectId, repoInfo) {
    return apiClient.post(API_ENDPOINTS.GITHUB.LINK_PROJECT, { projectId, repoInfo });
  }

  // Get task suggestions based on recent commit activity.
  getActivitySuggestions(projectId) {
    return apiClient.get(API_ENDPOINTS.GITHUB.SUGGESTIONS(projectId));
  }

  // Import and approve the suggested tasks for a project.
  approveTasks(projectId, tasks) {
    return apiClient.post(API_ENDPOINTS.GITHUB.APPROVE_TASKS, { projectId, tasks });
  }
}

export default new GithubService();
