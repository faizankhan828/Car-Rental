import axios from 'axios';

// Production must use the same Vercel deployment's API. This avoids stale
// VITE_API_URL values sending the admin panel to an old or wrong backend.
const BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL || '/api'
  : '/api';
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || 'primeride-admin-2024';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    config.headers['x-admin-key'] = ADMIN_KEY;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
