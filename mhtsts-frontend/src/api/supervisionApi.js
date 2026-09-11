import api from './axiosConfig';

export const supervisionApi = {
  getSupervisees: async () => {
    const response = await api.get('/supervision/supervisees');
    return response.data;
  },

  getPendingReviews: async () => {
    const response = await api.get('/supervision/reviews/pending');
    return response.data;
  },

  submitReview: async (reviewId, reviewData) => {
    const response = await api.post(`/supervision/reviews/${reviewId}`, reviewData);
    return response.data;
  }
};
