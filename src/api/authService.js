import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

class AuthService {
  getCurrentUser(config = {}) {
    return apiClient.get(API_ENDPOINTS.AUTH.ME, config);
  }

  login(email, password, config = {}) {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password }, config);
  }

  register(data, config = {}) {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data, config);
  }

  logout() {
    return apiClient.get(API_ENDPOINTS.AUTH.LOGOUT);
  }
  
  refreshSession() {
    return apiClient.get(API_ENDPOINTS.AUTH.REFRESH);
  }

  activateInvite(token, name, password) {
    return apiClient.post(API_ENDPOINTS.AUTH.ACTIVATE, { token, name, password });
  }

  completeOnboarding() {
    return apiClient.patch(API_ENDPOINTS.AUTH.ONBOARDING);
  }

  forgotPassword(email) {
    return apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  resetPassword(token, password) {
    return apiClient.patch(API_ENDPOINTS.AUTH.RESET_PASSWORD(token), { password });
  }
}

export default new AuthService();
