import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

class TeamService {
  inviteBulk(data) {
    return apiClient.post(API_ENDPOINTS.TEAM.INVITE_BULK, data);
  }

  getMembers() {
    return apiClient.get(API_ENDPOINTS.TEAM.MEMBERS);
  }

  getRoles() {
    return apiClient.get(API_ENDPOINTS.TEAM.ROLES);
  }
}

export default new TeamService();
