import api from './api';

export const createReview = (data) => api.post('/reviews', data);
export const getCarReviews = (carId, params) => api.get(`/reviews/car/${carId}`, { params });
export const getAllReviews = (params) => api.get('/reviews', { params });
export const moderateReview = (id, isApproved) => api.patch(`/reviews/${id}/approve`, { isApproved });
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
