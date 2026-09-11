import api from './axiosConfig';

export const analyticsApi = {
  getDashboardStats: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  getAppointmentStats: async (params) => {
    const response = await api.get('/analytics/appointments', { params });
    return response.data;
  },

  getClientStats: async (params) => {
    const response = await api.get('/analytics/clients', { params });
    return response.data;
  },

  getRevenueStats: async (params) => {
    const response = await api.get('/analytics/revenue', { params });
    return response.data;
  },
};
