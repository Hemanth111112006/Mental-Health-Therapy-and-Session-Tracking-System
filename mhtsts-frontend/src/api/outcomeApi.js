import api from './axiosConfig';

export const outcomeApi = {
  getAllOutcomes: async () => {
    let local = [];
    try {
      const saved = localStorage.getItem('mindcare_outcomes');
      if (saved) local = JSON.parse(saved);
    } catch (_) {}

    try {
      const response = await api.get('/outcome-measures');
      const data = response.data.data || response.data || [];
      const combined = Array.isArray(data) ? [...data] : [];
      local.forEach(l => {
        if (!combined.some(c => c.id === l.id)) combined.unshift(l);
      });
      return combined;
    } catch (err) {
      console.warn('API error fetching outcomes, using local fallback:', err);
      return local;
    }
  },

  getOutcomeById: async (id) => {
    try {
      const response = await api.get(`/outcome-measures/${id}`);
      return response.data.data || response.data;
    } catch (err) {
      const saved = JSON.parse(localStorage.getItem('mindcare_outcomes') || '[]');
      return saved.find(s => String(s.id) === String(id));
    }
  },

  getOutcomesByClient: async (clientId) => {
    let local = [];
    try {
      const saved = JSON.parse(localStorage.getItem('mindcare_outcomes') || '[]');
      local = saved.filter(s => String(s.clientId) === String(clientId) || String(s.client?.id) === String(clientId));
    } catch (_) {}

    try {
      const response = await api.get(`/outcome-measures/client/${clientId}`);
      const data = response.data.data || response.data || [];
      const combined = Array.isArray(data) ? [...data] : [];
      local.forEach(l => {
        if (!combined.some(c => c.id === l.id)) combined.unshift(l);
      });
      return combined;
    } catch (err) {
      console.warn('API error fetching client outcomes, using local fallback:', err);
      return local;
    }
  },

  createOutcome: async (outcomeData) => {
    // Send all possible field name variants — backend accepts aliases
    const payload = {
      clientId: outcomeData.clientId,
      instrumentName: outcomeData.instrumentName || outcomeData.measureType || 'OTHER',
      measureType: outcomeData.measureType || outcomeData.instrumentName || 'OTHER',
      score: outcomeData.score != null ? Math.round(Number(outcomeData.score)) : (outcomeData.totalScore != null ? Math.round(Number(outcomeData.totalScore)) : 0),
      totalScore: outcomeData.totalScore != null ? Math.round(Number(outcomeData.totalScore)) : (outcomeData.score != null ? Math.round(Number(outcomeData.score)) : 0),
      assessmentDate: outcomeData.assessmentDate || outcomeData.administrationDate || new Date().toISOString().split('T')[0],
      administrationDate: outcomeData.administrationDate || outcomeData.assessmentDate || new Date().toISOString().split('T')[0],
      interpretation: outcomeData.interpretation || outcomeData.notes || '',
      notes: outcomeData.notes || outcomeData.interpretation || '',
      severityLevel: outcomeData.severityLevel || null
    };

    try {
      const response = await api.post('/outcome-measures', payload);
      const saved = response.data.data || response.data;
      return saved;
    } catch (err) {
      console.warn('API error creating outcome measure, saving locally:', err);
      const localId = Date.now();
      const localOutcome = {
        ...payload,
        id: localId,
        createdAt: new Date().toISOString()
      };
      try {
        const existing = JSON.parse(localStorage.getItem('mindcare_outcomes') || '[]');
        existing.unshift(localOutcome);
        localStorage.setItem('mindcare_outcomes', JSON.stringify(existing));
      } catch (_) {}
      return localOutcome;
    }
  },

  updateOutcome: async (id, outcomeData) => {
    const payload = {
      ...outcomeData,
      totalScore: outcomeData.totalScore != null ? Math.round(Number(outcomeData.totalScore)) : outcomeData.score,
      score: outcomeData.score != null ? Math.round(Number(outcomeData.score)) : outcomeData.totalScore,
      administrationDate: outcomeData.administrationDate || outcomeData.assessmentDate
    };
    const response = await api.put(`/outcome-measures/${id}`, payload);
    return response.data.data || response.data;
  },

  deleteOutcome: async (id) => {
    const response = await api.delete(`/outcome-measures/${id}`);
    return response.data.data || response.data;
  }
};
