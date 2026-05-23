import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

export const getCurrentUser = (config = {}) => {
  return apiClient.get(API_ENDPOINTS.AUTH.ME, config);
};

export const login = (email, password, config = {}) => {
  return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password }, config);
};

export const register = (data, config = {}) => {
  return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data, config);
};

export const logout = () => {
  return apiClient.get(API_ENDPOINTS.AUTH.LOGOUT);
};

export const refreshSession = () => {
  return apiClient.get(API_ENDPOINTS.AUTH.REFRESH);
};

export const activateInvite = (token, name, password) => {
  return apiClient.post(API_ENDPOINTS.AUTH.ACTIVATE, { token, name, password });
};

export const completeOnboarding = () => {
  return apiClient.patch(API_ENDPOINTS.AUTH.ONBOARDING);
};

export const forgotPassword = (email) => {
  return apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
};

export const resetPassword = (token, password) => {
  return apiClient.patch(API_ENDPOINTS.AUTH.RESET_PASSWORD(token), {
    password,
  });
};

export const updateAvatar = (formData) => {
  return apiClient.patch(API_ENDPOINTS.AUTH.AVATAR, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default {
  getCurrentUser,
  login,
  register,
  logout,
  refreshSession,
  activateInvite,
  completeOnboarding,
  forgotPassword,
  resetPassword,
  updateAvatar,
};
