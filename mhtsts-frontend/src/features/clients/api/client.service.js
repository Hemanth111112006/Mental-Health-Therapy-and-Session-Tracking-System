import { clientApi } from '../../../api/clientApi';

class ClientService {
  async getAll(params = {}) {
    const result = await clientApi.getAllClients();
    
    let filteredResult = [...result];

    // Apply search filter
    if (params.search) {
      const q = params.search.toLowerCase();
      filteredResult = filteredResult.filter(c => 
        (c.firstName && c.firstName.toLowerCase().includes(q)) || 
        (c.lastName && c.lastName.toLowerCase().includes(q)) || 
        (c.clientNumber && c.clientNumber.toLowerCase().includes(q))
      );
    }

    // Apply status filter
    if (params.status && params.status !== 'ALL') {
      filteredResult = filteredResult.filter(c => c.status === params.status);
    }

    // Sort
    filteredResult.sort((a, b) => {
      const field = params.sortBy || 'lastName';
      const order = params.sortOrder === 'desc' ? -1 : 1;
      
      if (a[field] < b[field]) return -1 * order;
      if (a[field] > b[field]) return 1 * order;
      return 0;
    });

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedResult = filteredResult.slice(startIndex, endIndex);

    return {
      data: paginatedResult,
      total: filteredResult.length,
      page,
      limit,
      totalPages: Math.ceil(filteredResult.length / limit)
    };
  }

  async getById(id) {
    return await clientApi.getClientById(id);
  }

  async create(data) {
    return await clientApi.createClient(data);
  }

  async update(id, data) {
    return await clientApi.updateClient(id, data);
  }
}

export const clientService = new ClientService();
