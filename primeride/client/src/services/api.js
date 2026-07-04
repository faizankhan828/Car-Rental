import axios from 'axios';

// Relative path — works on ANY domain (cararental.vercel.app, rentacar-ruddy.vercel.app, etc.)
// Vercel rewrites /api/* → the serverless function, so no hardcoded domain needed.
const BASE_URL  = '/api';
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
