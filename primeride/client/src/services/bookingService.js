import api from './api';

export const createBooking = (data) => api.post('/bookings', data);
export const getMyBookings = (params) => api.get('/bookings/my', { params });
export const getAllBookings = (params) => api.get('/bookings', { params });
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const updateBookingStatus = (id, bookingStatus) =>
  api.patch(`/bookings/${id}/status`, { bookingStatus });
export const cancelBooking = (id) => api.post(`/bookings/${id}/cancel`);
