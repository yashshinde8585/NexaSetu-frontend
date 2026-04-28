import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

class MetricsService {
  /**
   * Dispatches a telemetry event to the strategic engine for analysis.
   */
  trackEvent(eventType, payload = {}) {
    return apiClient.post(API_ENDPOINTS.METRICS.EVENT, { eventType, payload });
  }

  // Common shorthand trackers
  trackSignup(workspaceName, plan) {
    return this.trackEvent('signup', { workspaceName, plan });
  }

  trackProjectCreated(projectId, name) {
    return this.trackEvent('project_created', { projectId, name });
  }

  trackTaskCreated(taskId, title) {
    return this.trackEvent('task_created', { taskId, title });
  }
}

export default new MetricsService();
