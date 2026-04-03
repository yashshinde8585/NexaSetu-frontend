import api from './axios';
import { API_ENDPOINTS } from '../constants';

// Service for AI-powered task extraction and portfolio insights.
class AiService {
  // Convert natural language text into structured task objects.
  async extractTaskFromText(text) {
    const response = await api.post(API_ENDPOINTS.AI.EXTRACT, { text });
    return response.data;
  }

  // Get strategic recommendations for the current project portfolio.
  async getPortfolioRecommendations() {
    const response = await api.get(API_ENDPOINTS.AI.RECOMMENDATIONS);
    return response.data;
  }

  // Retrieve activity logs processed by the AI system.
  async getActivityLogs() {
    const response = await api.get(API_ENDPOINTS.AI.ACTIVITY_LOGS);
    return response.data;
  }
}

export default new AiService();
