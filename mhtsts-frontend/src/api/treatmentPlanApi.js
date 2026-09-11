import api from './axiosConfig';

export const treatmentPlanApi = {
  getAllPlans: async () => {
    const response = await api.get('/treatment-plans');
    return response.data.data || response.data || [];
  },

  getPlanById: async (id) => {
    const response = await api.get(`/treatment-plans/${id}`);
    return response.data.data || response.data;
  },

  getPlansByClient: async (clientId) => {
    const response = await api.get(`/treatment-plans/client/${clientId}`);
    return response.data.data || response.data || [];
  },

  createPlan: async (planData) => {
    const payload = {
      client: planData.clientId ? { id: planData.clientId } : undefined,
      therapistId: planData.therapistId || undefined,
      diagnoses: planData.diagnoses || '',
      goals: planData.goals || '',
      interventions: planData.interventions || '',
      problemList: planData.problemList || planData.problems || '',
      clinicalFormulation: planData.clinicalFormulation || '',
      estimatedDuration: planData.estimatedDuration || '',
      status: planData.status || 'ACTIVE'
    };
    const response = await api.post('/treatment-plans', payload);
    return response.data.data || response.data;
  },

  updatePlan: async (id, planData) => {
    const response = await api.put(`/treatment-plans/${id}`, planData);
    return response.data.data || response.data;
  },

  deletePlan: async (id) => {
    const response = await api.delete(`/treatment-plans/${id}`);
    return response.data.data || response.data;
  }
};
