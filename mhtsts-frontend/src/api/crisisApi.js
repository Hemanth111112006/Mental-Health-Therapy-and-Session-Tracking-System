import api from './axiosConfig';

export const crisisApi = {
  getAllAssessments: async () => {
    const response = await api.get('/crisis-assessments');
    return response.data.data || response.data || [];
  },

  getAssessmentById: async (id) => {
    const response = await api.get(`/crisis-assessments/${id}`);
    return response.data.data || response.data;
  },

  getAssessmentsByClient: async (clientId) => {
    const response = await api.get(`/crisis-assessments/client/${clientId}`);
    return response.data.data || response.data || [];
  },

  createAssessment: async (assessmentData) => {
    const payload = {
      clientId: assessmentData.clientId,
      therapistId: assessmentData.therapistId,
      assessmentDate: assessmentData.assessmentDate || new Date().toISOString(),
      suicidalityLevel: assessmentData.suicidalityLevel || 'NONE',
      homicidalityLevel: assessmentData.homicidalityLevel || 'NONE',
      selfHarmRisk: assessmentData.selfHarmRisk || 'NONE',
      safetyPlanId: assessmentData.safetyPlanId || null,
      // actionTaken is REQUIRED — always provide a value
      actionTaken: assessmentData.actionTaken && assessmentData.actionTaken.trim() !== ''
        ? assessmentData.actionTaken
        : 'Assessment completed and documented',
      supervisorNotified: assessmentData.supervisorNotified || false,
      hospitalized: assessmentData.hospitalized || false,
      hospitalName: assessmentData.hospitalName || null
    };
    const response = await api.post('/crisis-assessments', payload);
    return response.data.data || response.data;
  },

  updateAssessment: async (id, assessmentData) => {
    const payload = {
      ...assessmentData,
      assessmentDate: assessmentData.assessmentDate || new Date().toISOString(),
      actionTaken: assessmentData.actionTaken || 'Assessment updated'
    };
    const response = await api.put(`/crisis-assessments/${id}`, payload);
    return response.data.data || response.data;
  },

  deleteAssessment: async (id) => {
    const response = await api.delete(`/crisis-assessments/${id}`);
    return response.data.data || response.data;
  }
};
