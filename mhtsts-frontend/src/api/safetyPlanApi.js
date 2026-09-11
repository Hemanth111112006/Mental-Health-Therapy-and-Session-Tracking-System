import api from './axiosConfig';

export const safetyPlanApi = {
  getAllPlans: async () => {
    const response = await api.get('/safety-plans');
    return response.data.data || response.data || [];
  },

  getPlanById: async (id) => {
    const response = await api.get(`/safety-plans/${id}`);
    return response.data.data || response.data;
  },

  getPlansByClient: async (clientId) => {
    const response = await api.get(`/safety-plans/client/${clientId}`);
    return response.data.data || response.data || [];
  },

  createPlan: async (planData) => {
    const payload = {
      clientId: planData.clientId,
      therapistId: planData.therapistId,
      warningSigns: planData.warningSigns || '',
      copingStrategies: planData.copingStrategies || '',
      socialSupports: planData.socialSupports || planData.supports || '',
      emergencyContacts: planData.emergencyContacts || '',
      crisisLines: planData.crisisLines || planData.crisisHotlines || ''
    };
    const response = await api.post('/safety-plans', payload);
    return response.data.data || response.data;
  },

  updatePlan: async (id, planData) => {
    const response = await api.put(`/safety-plans/${id}`, planData);
    return response.data.data || response.data;
  },

  deletePlan: async (id) => {
    const response = await api.delete(`/safety-plans/${id}`);
    return response.data.data || response.data;
  }
};
