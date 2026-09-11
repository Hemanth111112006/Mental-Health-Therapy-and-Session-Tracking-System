import api from './axiosConfig';

export const billingApi = {
  getAllInvoices: async () => {
    const response = await api.get('/billing/invoices');
    return response.data.data || response.data || [];
  },

  getInvoicesByClient: async (clientId) => {
    const response = await api.get(`/billing/invoices/client/${clientId}`);
    return response.data.data || response.data || [];
  },

  getInvoiceById: async (id) => {
    const response = await api.get(`/billing/invoices/${id}`);
    return response.data.data || response.data;
  },

  createInvoice: async (invoiceData) => {
    const response = await api.post('/billing/invoices', invoiceData);
    return response.data.data || response.data;
  },

  updateInvoice: async (id, invoiceData) => {
    const response = await api.put(`/billing/invoices/${id}`, invoiceData);
    return response.data.data || response.data;
  },

  processPayment: async (id, paymentData) => {
    const response = await api.post(`/billing/invoices/${id}/pay`, paymentData);
    return response.data.data || response.data;
  },
};
