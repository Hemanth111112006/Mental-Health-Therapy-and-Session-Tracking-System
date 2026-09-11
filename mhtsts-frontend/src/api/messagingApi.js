import api from './axiosConfig';

export const messagingApi = {
  getConversations: async () => {
    const response = await api.get('/messages');
    return response.data.data || response.data || [];
  },

  getMessagesByUserId: async (userId) => {
    const response = await api.get(`/messages/${userId}`);
    return response.data.data || response.data || [];
  },

  getMessages: async (userId) => {
    const response = await api.get(`/messages/${userId}`);
    return response.data.data || response.data || [];
  },

  sendMessage: async (messageData) => {
    const payload = {
      senderId: messageData.senderId,
      recipientId: messageData.recipientId || messageData.receiverId,
      receiverId: messageData.recipientId || messageData.receiverId,
      messageContent: messageData.messageContent || messageData.body || messageData.content || '',
      body: messageData.messageContent || messageData.body || messageData.content || ''
    };
    const response = await api.post('/messages/secure', payload);
    return response.data.data || response.data;
  },

  markAsRead: async (messageId) => {
    const response = await api.put(`/messages/${messageId}/read`);
    return response.data.data || response.data;
  }
};
