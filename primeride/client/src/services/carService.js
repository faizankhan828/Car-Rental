import api from './api';

// ── Public routes (no auth needed) ────────────────────────────────────────────
export const getCars = (params) => api.get('/cars', { params });
export const getCarById = (id) => api.get(`/cars/${id}`);

// ── Admin car management (uses x-admin-key header set in api.js) ──────────────
export const adminCreateCar = (data) => api.post('/cars', data);
export const adminUpdateCar = (id, data) => api.put(`/cars/${id}`, data);
export const adminDeleteCar = (id) => api.delete(`/cars/${id}`);
