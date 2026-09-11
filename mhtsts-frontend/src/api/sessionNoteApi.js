import api from './axiosConfig';

export const sessionNoteApi = {
  getAllSessionNotes: async () => {
    const response = await api.get('/session-notes');
    return response.data.data || response.data || [];
  },

  getSessionNotesByClient: async (clientId) => {
    const response = await api.get(`/session-notes/client/${clientId}`);
    return response.data.data || response.data;
  },

  createSessionNote: async (noteData) => {
    const response = await api.post('/session-notes', noteData);
    return response.data.data || response.data;
  },

  signSessionNote: async (id, data) => {
    const response = await api.put(`/session-notes/${id}/sign?therapistId=${data.therapistId}`);
    return response.data.data || response.data;
  },
  
  cosignSessionNote: async (id, data) => {
    const response = await api.put(`/session-notes/${id}/cosign?supervisorId=${data.supervisorId}`);
    return response.data.data || response.data;
  },

  // Psychotherapy notes (which have different rules)
  createPsychotherapyNote: async (noteData) => {
    const response = await api.post('/psychotherapy-notes', noteData);
    return response.data.data || response.data;
  },

  getPsychotherapyNoteById: async (id) => {
    const response = await api.get(`/psychotherapy-notes/${id}`);
    return response.data.data || response.data;
  }
};
