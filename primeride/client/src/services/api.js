import axios from 'axios';

// Must end with /api — e.g. https://cararental.vercel.app/api
const BASE_URL  = (import.meta.env.VITE_API_URL || 'https://cararental.vercel.app/api').replace(/\/$/, '');
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
