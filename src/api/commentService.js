import apiClient from './apiClient';

// Handles management of mission-critical task discussions and system-generated activity logs.
class CommentService {
  getTaskComments(taskId) {
    return apiClient.get(`/comments/task/${taskId}`);
  }

  addComment(taskId, content) {
    return apiClient.post(`/comments/task/${taskId}`, { content });
  }
}

export default new CommentService();
