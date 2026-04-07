import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

// Provides methods for managing the lifecycle of sprints.
class SprintService {
  getSprints(projectId) {
    return apiClient.get(API_ENDPOINTS.SPRINTS.BASE, {
      params: projectId ? { project: projectId } : {}
    });
  }

  // Create a new sprint with the provided configuration.
  createSprint(data) {
    return apiClient.post(API_ENDPOINTS.SPRINTS.BASE, data);
  }

  // Sync health metrics for a sprint.
  syncHealth(id) {
    return apiClient.post(`/sprints/${id}/sync`);
  }

  // Get analytics and statistics for a specific sprint.
  getSprintStats(id) {
    return apiClient.get(API_ENDPOINTS.SPRINTS.STATS(id));
  }

  // Complete and finalize an active sprint by its ID.
  finalizeSprint(id) {
    return apiClient.get(API_ENDPOINTS.SPRINTS.FINALIZE(id));
  }

  // Get a detailed summary report for a specific sprint.
  getSprintReport(id) {
    return apiClient.get(API_ENDPOINTS.SPRINTS.REPORT(id));
  }

  // Update the details or status of an existing sprint.
  updateSprint(id, data) {
    return apiClient.patch(API_ENDPOINTS.SPRINTS.DETAIL(id), data);
  }

  // Permanently remove a sprint from the project.
  deleteSprint(id) {
    return apiClient.delete(API_ENDPOINTS.SPRINTS.DETAIL(id));
  }
}

export default new SprintService();
