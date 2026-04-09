import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

// Service for handling user authentication and session management.
class AuthService {
  // Fetch information about the currently logged-in user.
  getCurrentUser() {
    return apiClient.get(API_ENDPOINTS.AUTH.ME);
  }

  // Authenticate a user with their email and password.
  login(email, password) {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
  }

  // Create a new user account with the provided details.
  register(data) {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
  }

  // End the user's current session and log them out.
  logout() {
    return apiClient.get(API_ENDPOINTS.AUTH.LOGOUT);
  }
  
  // Explicitly rotate session tokens.
  refreshSession() {
    return apiClient.get(API_ENDPOINTS.AUTH.REFRESH);
  }

  // Activate a user account using an invitation token.
  activateInvite(token, name, password) {
    return apiClient.post(API_ENDPOINTS.AUTH.ACTIVATE, { token, name, password });
  }

  // Mark the user onboarding process as completed.
  completeOnboarding() {
    return apiClient.patch(API_ENDPOINTS.AUTH.ONBOARDING);
  }
}

export default new AuthService();
