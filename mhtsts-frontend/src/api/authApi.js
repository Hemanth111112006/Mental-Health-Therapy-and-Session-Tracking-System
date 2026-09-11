import api from './axiosConfig';

export const authApi = {
  login: async (credentials) => {
    // Relying on axios interceptors for error throwing
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  oauthLogin: async (oauthData) => {
    const response = await api.post('/auth/oauth-login', oauthData);
    return response.data;
  }
};
