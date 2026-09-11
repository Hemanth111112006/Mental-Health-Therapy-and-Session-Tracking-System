import { mockAppointments, mockClients } from '../../../lib/mockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

let appointments = [...mockAppointments];

class AppointmentService {
  async getAll(params = {}) {
    await delay(500);
    let result = [...appointments];

    // Filter by therapist if provided
    if (params.therapistId) {
      result = result.filter(a => a.therapistId === parseInt(params.therapistId));
    }
    
    // Sort by date/time ascending
    result.sort((a, b) => {
      const dateA = new Date(`${a.appointmentDate}T${a.startTime}`);
      const dateB = new Date(`${b.appointmentDate}T${b.startTime}`);
      return dateA - dateB;
    });

    // Attach client details for convenience
    const enriched = result.map(app => {
      const client = mockClients.find(c => c.id === app.clientId);
      return { ...app, client };
    });

    return enriched;
  }

  async getUpcoming(therapistId, days = 7) {
    await delay(300);
    // For mock purposes, treat today as July 11, 2025 (midpoint of mock data)
    const today = new Date('2025-07-11T00:00:00');
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);

    const upcoming = appointments.filter(a => {
      if (therapistId && a.therapistId !== parseInt(therapistId)) return false;
      const appDate = new Date(a.appointmentDate);
      return appDate >= today && appDate <= futureDate && a.status === 'SCHEDULED';
    });
    
    // Attach client details
    return upcoming.map(app => {
      const client = mockClients.find(c => c.id === app.clientId);
      return { ...app, client };
    }).sort((a, b) => new Date(`${a.appointmentDate}T${a.startTime}`) - new Date(`${b.appointmentDate}T${b.startTime}`));
  }

  async getById(id) {
    await delay(400);
    const appointment = appointments.find(a => a.id === parseInt(id));
    if (!appointment) throw new Error('Appointment not found');
    
    const client = mockClients.find(c => c.id === appointment.clientId);
    return { ...appointment, client };
  }

  async create(data) {
    await delay(800);
    const newId = Math.max(...appointments.map(a => a.id), 1000) + 1;
    const newApp = {
      ...data,
      id: newId,
      status: 'SCHEDULED'
    };
    if (data.modality === 'Telehealth') {
      newApp.telehealthLink = `https://telehealth.mindcare.com/room/${newId}`;
    }
    appointments.push(newApp);
    return newApp;
  }

  async updateStatus(id, status) {
    await delay(600);
    const index = appointments.findIndex(a => a.id === parseInt(id));
    if (index === -1) throw new Error('Appointment not found');
    
    appointments[index] = { ...appointments[index], status };
    return appointments[index];
  }
}

export const appointmentService = new AppointmentService();
