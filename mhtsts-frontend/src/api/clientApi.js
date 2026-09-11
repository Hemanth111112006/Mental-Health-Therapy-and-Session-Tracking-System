import api from './axiosConfig';
import { mockClients } from '../lib/mockData';

export const clientApi = {
  getAllClients: async () => {
    try {
      const response = await api.get('/clients');
      const data = response.data.data || response.data;
      if (Array.isArray(data) && data.length > 0) return data;
      return mockClients;
    } catch (err) {
      console.warn('API error fetching clients, using mockClients fallback:', err);
      return mockClients;
    }
  },

  getClientById: async (id) => {
    try {
      const response = await api.get(`/clients/${id}`);
      return response.data.data || response.data;
    } catch (err) {
      console.warn('API error fetching client by ID, using mockClients fallback:', err);
      const client = mockClients.find(c => String(c.id) === String(id));
      if (client) return client;
      throw err;
    }
  },

  createClient: async (clientData) => {
    const payload = {
      ...clientData,
      phoneNumber: clientData.phoneNumber || clientData.phone,
      emergencyContactPhone: clientData.emergencyContactPhone || clientData.emergencyPhone,
      status: clientData.status || 'ACTIVE'
    };
    try {
      const response = await api.post('/clients', payload);
      return response.data.data || response.data;
    } catch (err) {
      console.warn('API error creating client, storing locally in mock data:', err);
      const newId = Math.floor(Math.random() * 9000) + 2000;
      const newClient = {
        ...payload,
        id: newId,
        clientNumber: `MC-${new Date().getFullYear()}-${newId}`,
        createdAt: new Date().toISOString()
      };
      mockClients.unshift(newClient);
      return newClient;
    }
  },

  updateClient: async (id, clientData) => {
    const payload = {
      ...clientData,
      phoneNumber: clientData.phoneNumber || clientData.phone,
      emergencyContactPhone: clientData.emergencyContactPhone || clientData.emergencyPhone
    };
    try {
      const response = await api.put(`/clients/${id}`, payload);
      return response.data.data || response.data;
    } catch (err) {
      console.warn('API error updating client, updating locally:', err);
      const index = mockClients.findIndex(c => String(c.id) === String(id));
      if (index !== -1) {
        mockClients[index] = { ...mockClients[index], ...payload };
        return mockClients[index];
      }
      return { id, ...payload };
    }
  },

  deleteClient: async (id) => {
    try {
      const response = await api.delete(`/clients/${id}`);
      return response.data.data || response.data;
    } catch (err) {
      console.warn('API error deleting client, removing locally:', err);
      const index = mockClients.findIndex(c => String(c.id) === String(id));
      if (index !== -1) {
        mockClients.splice(index, 1);
      }
      return { success: true };
    }
  },

  assignTherapist: async (clientId, therapistId) => {
    try {
      const response = await api.put(`/clients/${clientId}/assign-therapist/${therapistId}`);
      return response.data.data || response.data;
    } catch (err) {
      console.warn('API error assigning therapist, updating locally:', err);
      const client = mockClients.find(c => String(c.id) === String(clientId));
      if (client) {
        client.assignedTherapistId = therapistId;
      }
      return { success: true };
    }
  }
};
