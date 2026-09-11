import api from './axiosConfig';

export const reportApi = {
  getAllReports: async () => {
    try {
      const response = await api.get('/reports');
      return response.data?.data || response.data || [];
    } catch (e) {
      console.warn('Backend /reports endpoint notice:', e);
      return null;
    }
  },

  getReportById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data?.data || response.data;
  },

  createReport: async (reportData) => {
    const payload = {
      reportNumber: reportData.id || reportData.reportNumber,
      name: reportData.name,
      type: reportData.type,
      date: reportData.date,
      author: reportData.author,
      description: reportData.description || '',
      kpis: typeof reportData.kpis === 'string' ? reportData.kpis : JSON.stringify(reportData.kpis || []),
      tableHeaders: typeof reportData.tableHeaders === 'string' ? reportData.tableHeaders : JSON.stringify(reportData.tableHeaders || []),
      tableRows: typeof reportData.tableRows === 'string' ? reportData.tableRows : JSON.stringify(reportData.tableRows || [])
    };
    const response = await api.post('/reports', payload);
    return response.data?.data || response.data;
  },

  deleteReport: async (id) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data?.data || response.data;
  },

  generateReport: async (reportRequest) => {
    const response = await api.post('/reports/generate', reportRequest, {
      responseType: 'blob'
    });
    return response.data;
  },

  getSavedReports: async () => {
    const response = await api.get('/reports');
    return response.data?.data || response.data || [];
  }
};
