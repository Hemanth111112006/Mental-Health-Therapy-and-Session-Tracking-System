import api from './axiosConfig';

const CANONICAL_STAFF = {
  'admin@mindcare.com': { firstName: 'System', lastName: 'Administrator', title: 'Practice Administrator', phone: '+1 (555) 019-2831' },
  'therapist@mindcare.com': { firstName: 'Dr. Sarah', lastName: 'Chen, LCSW', title: 'Lead Clinical Therapist', phone: '+1 (555) 021-9874' },
  'psychologist@mindcare.com': { firstName: 'Dr. Maya', lastName: 'Patel, PsyD', title: 'Clinical Psychologist', phone: '+1 (555) 034-7128' },
  'psychiatrist@mindcare.com': { firstName: 'Dr. Mark', lastName: 'Rivera, MD', title: 'Staff Psychiatrist', phone: '+1 (555) 045-8291' },
  'supervisor@mindcare.com': { firstName: 'Dr. Kevin', lastName: 'Torres, MD', title: 'Clinical Director & Supervisor', phone: '+1 (555) 056-9302' },
  'case_manager@mindcare.com': { firstName: 'Marcus', lastName: 'Vance, MSW', title: 'Lead Case Manager', phone: '+1 (555) 067-1453' },
  'receptionist@mindcare.com': { firstName: 'Jennifer', lastName: 'Adams', title: 'Front Desk Coordinator', phone: '+1 (555) 078-2564' },
  'client@mindcare.com': { firstName: 'Taylor', lastName: 'Morgan', title: 'Patient / Client', phone: '+1 (555) 123-9876' }
};

export const userApi = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    const users = response.data.data || response.data || [];
    return users.map(u => {
      const canonical = CANONICAL_STAFF[u.username] || CANONICAL_STAFF[u.email] || {};
      return {
        ...u,
        firstName: u.firstName || canonical.firstName || u.username?.split('@')[0] || 'User',
        lastName: u.lastName !== undefined && u.lastName !== null ? u.lastName : (canonical.lastName || ''),
        phone: u.phone || u.phoneNumber || canonical.phone || '+1 (555) 010-0000',
        title: canonical.title || (u.role ? u.role.replace('_', ' ') : 'Staff Member')
      };
    });
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    const u = response.data.data || response.data;
    const canonical = CANONICAL_STAFF[u?.username] || CANONICAL_STAFF[u?.email] || {};
    return {
      ...u,
      firstName: u.firstName || canonical.firstName || u.username?.split('@')[0] || 'User',
      lastName: u.lastName !== undefined && u.lastName !== null ? u.lastName : (canonical.lastName || ''),
      phone: u.phone || canonical.phone || '+1 (555) 010-0000',
      title: canonical.title || 'Staff Member'
    };
  },

  createUser: async (userData) => {
    const backendData = {
      ...userData,
      username: userData.firstName ? `${userData.firstName}${userData.lastName || ''}`.toLowerCase().replace(/\s+/g, '') : userData.email.split('@')[0],
      passwordHash: 'TEMP_DEFAULT_HASH' // Required by backend
    };
    const response = await api.post('/users', backendData);
    const u = response.data;
    return { ...u, firstName: userData.firstName, lastName: userData.lastName, phone: userData.phone };
  },

  updateUser: async (id, userData) => {
    const backendData = {
      ...userData,
      username: userData.firstName ? `${userData.firstName}${userData.lastName || ''}`.toLowerCase().replace(/\s+/g, '') : userData.email?.split('@')[0] || userData.username,
      passwordHash: 'TEMP_DEFAULT_HASH'
    };
    const response = await api.put(`/users/${id}`, backendData);
    const u = response.data;
    return { ...u, firstName: userData.firstName, lastName: userData.lastName, phone: userData.phone };
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};
