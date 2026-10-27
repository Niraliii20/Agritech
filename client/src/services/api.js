import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Request interceptor: attach JWT Bearer token ──────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agritech_token');
    if (token) {
      // Proactively check token expiry before sending the request
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp && Date.now() / 1000 > payload.exp;
        if (isExpired) {
          localStorage.removeItem('agritech_token');
          localStorage.removeItem('agritech_user');
          window.location.href = '/login';
          return Promise.reject(new Error('Token expired'));
        }
      } catch {
        // Malformed token — remove it
        localStorage.removeItem('agritech_token');
        localStorage.removeItem('agritech_user');
      }
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 Unauthorized ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      if (!isLoginRequest) {
        localStorage.removeItem('agritech_token');
        localStorage.removeItem('agritech_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
