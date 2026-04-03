import api from './axios';
import { API_ENDPOINTS } from '../constants';

// Service for handling user authentication and session management.
class AuthService {
  // Fetch information about the currently logged-in user.
  async getCurrentUser() {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  }

  // Authenticate a user with their email and password.
  async login(email, password) {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data;
  }

  // Create a new user account with the provided details.
  async register(data) {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  }

  // End the user's current session and log them out.
  async logout() {
    const response = await api.get(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  }

  // Activate a user account using an invitation token.
  async activateInvite(token, name, password) {
    const response = await api.post(API_ENDPOINTS.AUTH.ACTIVATE, {
      token,
      name,
      password,
    });
    return response.data;
  }

  // Mark the user onboarding process as completed.
  async completeOnboarding() {
    const response = await api.patch(API_ENDPOINTS.AUTH.ONBOARDING);
    return response.data;
  }
}

export default new AuthService();
