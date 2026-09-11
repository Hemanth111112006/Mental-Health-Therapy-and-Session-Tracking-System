import api from './axiosConfig';

export const dashboardApi = {
  getAdminDashboard: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  getClinicalDashboard: async () => {
    const response = await api.get('/dashboard/clinical');
    return response.data;
  },
  
  getClientDashboard: async () => {
    const response = await api.get('/dashboard/client');
    return response.data;
  }
};
