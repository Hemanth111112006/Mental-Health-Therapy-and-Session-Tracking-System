import axios from 'axios';

// ─── Single Axios instance used across the entire frontend ───────────────────
// Base URL is read from the Vite environment variable VITE_API_BASE_URL.
// The Vite dev-server proxy (/api → http://localhost:8080) is kept as a fallback
// so that the app also works without the env file in development.
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 s – avoids hanging requests when backend is slow
});

// ─── Request interceptor ─────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // Only attach a non-empty, non-null token
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ────────────────────────────────────────────────────
api.interceptors.response.use(
  // 2xx – pass through unchanged
  (response) => response,

  // Non-2xx – normalise into a consistent error shape
  (error) => {
    const status  = error.response?.status;
    const data    = error.response?.data;

    switch (status) {
      case 400:
        // Bad Request – surface validation message from backend if present
        return Promise.reject({
          status,
          message: data?.message || 'Invalid request. Please check your input.',
          errors:  data?.errors  || null,
        });

      case 401:
        // Unauthorized – token missing or expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Only redirect if we are not already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject({
          status,
          message: data?.message || 'Session expired. Please log in again.',
        });

      case 403:
        return Promise.reject({
          status,
          message: data?.message || 'You do not have permission to perform this action.',
        });

      case 404:
        return Promise.reject({
          status,
          message: data?.message || 'The requested resource was not found.',
        });

      case 409:
        return Promise.reject({
          status,
          message: data?.message || 'A conflict occurred. The resource may already exist.',
        });

      case 500:
        return Promise.reject({
          status,
          message: 'An internal server error occurred. Please try again later.',
        });

      default:
        if (!error.response) {
          // Network error / backend unavailable
          return Promise.reject({
            status: 0,
            message: 'Unable to connect to the server. Please check your connection.',
          });
        }
        return Promise.reject({
          status,
          message: data?.message || 'An unexpected error occurred.',
        });
    }
  }
);

export default api;
