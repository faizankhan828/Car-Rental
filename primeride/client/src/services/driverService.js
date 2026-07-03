import api from './api';

export const getDrivers = (params) => api.get('/drivers', { params });
export const getDriverById = (id) => api.get(`/drivers/${id}`);
export const getDriverAvailability = (id) => api.get(`/drivers/${id}/availability`);

export const createDriver = (formData) =>
  api.post('/drivers', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updateDriver = (id, formData) =>
  api.put(`/drivers/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
