import api from './axiosConfig';

export const adminApi = {
  getSystemSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSystemSettings: async (settings) => {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  },

  getAuditLogs: async (params) => {
    const response = await api.get('/admin/audit-logs', { params });
    return response.data;
  }
};
