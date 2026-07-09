import axios from 'axios';

// ==========================================
// 1. General API Client (Customer / Public)
// ==========================================
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.chopnchop.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-App-Brand': 'CHOP_N_CHOP',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      if (typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// 2. Vendor API Client
// ==========================================
export const vendorApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.chopnchop.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-App-Brand': 'CHOP_N_CHOP',
  },
});

vendorApiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('vendor_access_token');
      if (token) {
        if (config.headers && typeof config.headers.set === 'function') {
          config.headers.set('Authorization', `Bearer ${token}`);
        } else {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.warn('Failed to read vendor token:', error);
    }
  }
  return config;
});

vendorApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('vendorUser');
        localStorage.removeItem('vendor_access_token');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// 3. Admin API Client
// ==========================================
export const adminApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.chopnchop.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-App-Brand': 'CHOP_N_CHOP',
  },
});

adminApiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('admin_access_token');
      if (token) {
        if (config.headers && typeof config.headers.set === 'function') {
          config.headers.set('Authorization', `Bearer ${token}`);
        } else {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.warn('Failed to read admin token:', error);
    }
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

adminApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (error.response.data?.message?.includes('revoked')) {
        localStorage.clear();
        window.location.href = '/';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && typeof originalRequest.headers.set === 'function') {
              originalRequest.headers.set('Authorization', `Bearer ${token}`);
            } else {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return adminApiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('admin_refresh_token');

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://api.chopnchop.com/v1'}/api/v1/auth/refresh`,
          { token: refreshToken },
          { headers: { 'X-App-Brand': 'CHOP_N_CHOP', 'Content-Type': 'application/json' } }
        );

        localStorage.setItem('admin_access_token', data.access_token || data.accessToken);
        if (data.refresh_token || data.refreshToken) {
          localStorage.setItem('admin_refresh_token', data.refresh_token || data.refreshToken);
        }

        processQueue(null, data.access_token || data.accessToken);

        if (originalRequest.headers && typeof originalRequest.headers.set === 'function') {
          originalRequest.headers.set('Authorization', `Bearer ${data.access_token || data.accessToken}`);
        } else {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = `Bearer ${data.access_token || data.accessToken}`;
        }
        
        return adminApiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = '/';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
