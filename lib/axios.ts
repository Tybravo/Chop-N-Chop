import axios from 'axios';

// Create a centralized axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.chopnchop.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available (Phase 2/3)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Global error handling
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // Handle unauthorized (e.g., redirect to login or clear token)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      }
    }
    return Promise.reject(error);
  }
);
