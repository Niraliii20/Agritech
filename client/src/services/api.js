import axios from 'axios';
import { getMockDataForUrl } from './mockData';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://agritech-scs4.onrender.com/api';
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 6000,
});

// ── Request interceptor ──────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agritech_token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor with graceful mock fallback on Vercel/offline ─
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';

    // If 401 on auth/login, allow the error through for wrong passwords
    if (error.response?.status === 401 && url.includes('/auth/login')) {
      return Promise.reject(error);
    }

    // For any failed API request (404 on Vercel, server asleep, or no MongoDB), serve demo data
    console.warn(`[AgriTech Demo Mode] API endpoint ${url} handled with demo data.`);
    const mockData = getMockDataForUrl(url);

    return Promise.resolve({
      data: mockData,
      status: 200,
      statusText: 'OK (Demo Mode)',
      headers: {},
      config: error.config,
    });
  }
);

export default api;
