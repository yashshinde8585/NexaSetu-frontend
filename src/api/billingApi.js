import api from './axios';

const BillingService = {
  getPlans: async () => {
    const res = await api.get('/billing/plans');
    return res.data;
  },

  getSubscription: async () => {
    const res = await api.get('/billing/subscription');
    return res.data;
  },

  selectPlan: async (plan, workspaceId) => {
    const res = await api.post('/billing/select-plan', { plan, workspaceId });
    return res.data;
  },

  cancelSubscription: async () => {
    const res = await api.post('/billing/cancel');
    return res.data;
  },
};

export default BillingService;
