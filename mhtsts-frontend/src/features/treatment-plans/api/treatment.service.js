import { mockTreatmentPlans, mockClients } from '../../../lib/mockData';
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
let plans = [...mockTreatmentPlans];

class TreatmentService {
  async getAll(params = {}) {
    await delay(500);
    let result = [...plans];
    if (params.therapistId) result = result.filter(n => n.therapistId === parseInt(params.therapistId));
    return result.map(p => ({...p, client: mockClients.find(c => c.id === p.clientId)}));
  }
}
export const treatmentService = new TreatmentService();