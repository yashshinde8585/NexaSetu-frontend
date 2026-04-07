import apiClient from './apiClient';

const strategicService = {
  getHub:          (projectId)                  => apiClient.get(`/strategic/hub/${projectId}`),
  generateStories: (intentId)                   => apiClient.post('/strategic/generate', { intentId }),
  updateAlignment: (taskId, alignmentData)      => apiClient.patch(`/strategic/alignment/${taskId}`, alignmentData),
  getGraph:        (projectId)                  => apiClient.get('/strategic/graph', { params: { projectId } }),
};

export default strategicService;
