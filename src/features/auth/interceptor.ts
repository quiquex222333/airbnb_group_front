import axios from 'axios';
import { apiClient } from './api';
import { useAuthStore } from './store';

// Flag para evitar múltiples refreshes simultáneos
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor: inyecta Access Token en cada petición
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor: maneja 401 con refresh automático
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si la petición ya es de auth, no intentamos refrescar para evitar bucles
    if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
      return Promise.reject(error);
    }

    // Si arroja 401 y no hemos re-intentado ya
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        const user = res.data.user;

        useAuthStore.getState().setCredentials(user, newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().logout();
        
        // Solo redirigimos si no estamos ya en login o register para evitar el bucle de refresco
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
