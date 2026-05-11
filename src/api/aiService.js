import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

// Service for AI-powered task extraction and portfolio insights.
export const extractTaskFromText = (text) => {
  return apiClient.post(API_ENDPOINTS.AI.EXTRACT, { text });
};

export const getPortfolioRecommendations = () => {
  return apiClient.get(API_ENDPOINTS.AI.RECOMMENDATIONS);
};

export const getActivityLogs = () => {
  return apiClient.get(API_ENDPOINTS.AI.ACTIVITY_LOGS);
};

export default {
  extractTaskFromText,
  getPortfolioRecommendations,
  getActivityLogs,
};

