import api from './axiosConfig';

export const notificationApi = {
  getMyNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data.data || response.data || [];
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data.data || response.data;
  },

  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/read-all');
      return response.data.data || response.data;
    } catch {
      const res = await api.get('/notifications');
      const list = res.data.data || res.data || [];
      const unread = list.filter(n => !n.isRead);
      await Promise.all(unread.map(n => api.put(`/notifications/${n.id}/read`)));
      return true;
    }
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data.data || response.data;
  },

  createNotification: async (notificationData) => {
    const response = await api.post('/notifications', notificationData);
    return response.data.data || response.data;
  }
};
