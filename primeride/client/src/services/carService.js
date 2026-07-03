import api from './api';

export const getCars = (params) => api.get('/cars', { params });
export const getCarById = (id) => api.get(`/cars/${id}`);
export const getCarAvailability = (id, params) => api.get(`/cars/${id}/availability`, { params });

export const createCar = (formData) =>
  api.post('/cars', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updateCar = (id, formData) =>
  api.put(`/cars/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const deleteCar = (id) => api.delete(`/cars/${id}`);
export const deleteCarImage = (carId, publicId) =>
  api.delete(`/cars/${carId}/images/${encodeURIComponent(publicId)}`);

export const uploadCarImage = (formData) =>
  api.post('/uploads/car-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
