import api from './axiosConfig';

export const appointmentApi = {
  getAllAppointments: async () => {
    const response = await api.get('/appointments');
    const appts = response.data.data || response.data;
    return appts.map(appt => {
      let resolvedClientName = null;
      if (appt.cancellationReason && appt.cancellationReason.includes('Client: ')) {
        const match = appt.cancellationReason.match(/Client:\s*([^·\n()]+)/);
        if (match && match[1]?.trim()) resolvedClientName = match[1].trim();
      }
      if (!resolvedClientName && appt.participants?.[0]?.client) {
        const c = appt.participants[0].client;
        if (c.firstName && !c.firstName.includes('=') && c.firstName !== 'Unknown') {
          resolvedClientName = `${c.firstName} ${c.lastName || ''}`.trim();
        } else if (c.email) {
          resolvedClientName = c.email.split('@')[0];
        }
      }

      return {
        ...appt,
        date: appt.startTime ? appt.startTime.split('T')[0] : '',
        startTime: appt.startTime ? appt.startTime.split('T')[1].substring(0, 5) : '',
        endTime: appt.endTime ? appt.endTime.split('T')[1].substring(0, 5) : '',
        type: appt.appointmentType,
        telehealth: appt.modality === 'TELEHEALTH',
        clientId: appt.participants?.[0]?.client?.id,
        clientName: resolvedClientName || 'Client'
      };
    });
  },

  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    const appt = response.data.data || response.data;
    let resolvedClientName = null;
    if (appt.cancellationReason && appt.cancellationReason.includes('Client: ')) {
      const match = appt.cancellationReason.match(/Client:\s*([^·\n()]+)/);
      if (match && match[1]?.trim()) resolvedClientName = match[1].trim();
    }
    if (!resolvedClientName && appt.participants?.[0]?.client) {
      const c = appt.participants[0].client;
      if (c.firstName && !c.firstName.includes('=') && c.firstName !== 'Unknown') {
        resolvedClientName = `${c.firstName} ${c.lastName || ''}`.trim();
      } else if (c.email) {
        resolvedClientName = c.email.split('@')[0];
      }
    }

    return {
      ...appt,
      date: appt.startTime ? appt.startTime.split('T')[0] : '',
      startTime: appt.startTime ? appt.startTime.split('T')[1].substring(0, 5) : '',
      endTime: appt.endTime ? appt.endTime.split('T')[1].substring(0, 5) : '',
      type: appt.appointmentType,
      telehealth: appt.modality === 'TELEHEALTH',
      clientId: appt.participants?.[0]?.client?.id,
      clientName: resolvedClientName || 'Client'
    };
  },

  scheduleAppointment: async (appointmentData) => {
    let apptType = 'INDIVIDUAL_THERAPY';
    const rawType = (appointmentData.type || '').toUpperCase().trim();
    if (rawType.includes('INIT')) apptType = 'INITIAL';
    else if (rawType.includes('CRISIS')) apptType = 'CRISIS';
    else if (rawType.includes('DISCHARGE')) apptType = 'DISCHARGE';
    else if (rawType.includes('FOLLOW')) apptType = 'FOLLOW_UP';
    else if (rawType.includes('GROUP')) apptType = 'GROUP_THERAPY';
    else if (rawType.includes('CONSULT')) apptType = 'CONSULTATION';
    else if (rawType.includes('ASSESS')) apptType = 'ASSESSMENT';
    else if (['INITIAL', 'FOLLOW_UP', 'CRISIS', 'DISCHARGE', 'INDIVIDUAL_THERAPY', 'GROUP_THERAPY', 'CONSULTATION', 'ASSESSMENT'].includes(rawType)) {
      apptType = rawType;
    } else {
      apptType = 'INDIVIDUAL_THERAPY';
    }

    const startTimeFormatted = appointmentData.startTime?.length === 5 
      ? `${appointmentData.startTime}:00` 
      : (appointmentData.startTime || '09:00:00');
    const endTimeFormatted = appointmentData.endTime?.length === 5 
      ? `${appointmentData.endTime}:00` 
      : (appointmentData.endTime || '10:00:00');

    const backendData = {
      startTime: `${appointmentData.date}T${startTimeFormatted}`,
      endTime: `${appointmentData.date}T${endTimeFormatted}`,
      appointmentType: apptType,
      modality: appointmentData.telehealth ? 'TELEHEALTH' : 'IN_PERSON',
      status: appointmentData.status || 'SCHEDULED',
      cancellationReason: appointmentData.notes || null,
      therapist: appointmentData.providerId ? { id: Number(appointmentData.providerId) } : null,
      participants: appointmentData.clientId ? [{ client: { id: Number(appointmentData.clientId) } }] : []
    };
    const response = await api.post('/appointments', backendData);
    return response.data.data || response.data;
  },

  updateAppointment: async (id, appointmentData) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data.data || response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/appointments/${id}/status?status=${status}`);
    return response.data.data || response.data;
  },

  cancelAppointment: async (id) => {
    const response = await api.put(`/appointments/${id}/status?status=CANCELLED`);
    return response.data.data || response.data;
  }
};
