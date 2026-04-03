import api from './axios';
import { API_ENDPOINTS } from '../constants';

class TeamService {
  async inviteBulk(data) {
    const response = await api.post(API_ENDPOINTS.TEAM.INVITE_BULK, data);
    return response.data;
  }

  async getMembers() {
    const response = await api.get(API_ENDPOINTS.TEAM.MEMBERS);
    return response.data;
  }
}

export default new TeamService();
