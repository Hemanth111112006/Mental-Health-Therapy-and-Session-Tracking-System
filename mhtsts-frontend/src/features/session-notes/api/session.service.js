import { mockSessionNotes, mockClients, mockAppointments } from '../../../lib/mockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

let sessionNotes = [...mockSessionNotes];

class SessionService {
  async getAll(params = {}) {
    await delay(500);
    let result = [...sessionNotes];

    if (params.therapistId) {
      result = result.filter(n => n.therapistId === parseInt(params.therapistId));
    }

    if (params.clientId) {
      result = result.filter(n => n.clientId === parseInt(params.clientId));
    }

    // Attach client details
    const enriched = result.map(note => {
      const client = mockClients.find(c => c.id === note.clientId);
      const appointment = mockAppointments.find(a => a.id === note.appointmentId);
      return { ...note, client, appointment };
    });

    // Sort by created date descending
    return enriched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    await delay(400);
    const note = sessionNotes.find(n => n.id === parseInt(id));
    if (!note) throw new Error('Session note not found');
    
    const client = mockClients.find(c => c.id === note.clientId);
    const appointment = mockAppointments.find(a => a.id === note.appointmentId);
    return { ...note, client, appointment };
  }

  async create(data) {
    await delay(800);
    const newId = Math.max(...sessionNotes.map(n => n.id), 5000) + 1;
    const newNote = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
      supervisorSignedAt: null // initial draft is unsigned by supervisor
    };
    sessionNotes.push(newNote);
    return newNote;
  }

  async signNote(id, signatureData) {
    await delay(600);
    const index = sessionNotes.findIndex(n => n.id === parseInt(id));
    if (index === -1) throw new Error('Session note not found');
    
    // In a real app, this would store an e-signature timestamp and hash
    sessionNotes[index] = { 
      ...sessionNotes[index], 
      therapistSignedAt: new Date().toISOString(),
      status: 'SIGNED'
    };
    return sessionNotes[index];
  }
}

export const sessionService = new SessionService();
