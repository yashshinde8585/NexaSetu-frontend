import api from './axios';
import { API_ENDPOINTS } from '../constants';

// Provides methods for managing the lifecycle of sprints.
class SprintService {
  // Fetch all available sprints from the database.
  async getSprints() {
    const response = await api.get(API_ENDPOINTS.SPRINTS.BASE);
    return response.data;
  }

  // Create a new sprint with the provided configuration.
  async createSprint(data) {
    const response = await api.post(API_ENDPOINTS.SPRINTS.BASE, data);
    return response.data;
  }

  // Get analytics and statistics for a specific sprint.
  async getSprintStats(id) {
    const response = await api.get(API_ENDPOINTS.SPRINTS.STATS(id));
    return response.data;
  }

  // Complete and finalize an active sprint by its ID.
  async finalizeSprint(id) {
    const response = await api.get(API_ENDPOINTS.SPRINTS.FINALIZE(id));
    return response.data;
  }

  // Get a detailed summary report for a specific sprint.
  async getSprintReport(id) {
    const response = await api.get(API_ENDPOINTS.SPRINTS.REPORT(id));
    return response.data;
  }

  // Update the details or status of an existing sprint.
  async updateSprint(id, data) {
    const response = await api.patch(API_ENDPOINTS.SPRINTS.DETAIL(id), data);
    return response.data;
  }

  // Permanently remove a sprint from the project.
  async deleteSprint(id) {
    const response = await api.delete(API_ENDPOINTS.SPRINTS.DETAIL(id));
    return response.data;
  }
}

export default new SprintService();
