import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || 'primeride-admin-2024';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // no cookies needed — we use admin key
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach admin key on every request so car/upload operations work
api.interceptors.request.use(
  (config) => {
    config.headers['x-admin-key'] = ADMIN_KEY;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
