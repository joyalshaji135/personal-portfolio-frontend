import axios from 'axios';
import { store } from '../store/store';
import { logoutUser, refreshToken } from '../store/slices/authSlice';

// API base URL - Use import.meta.env for Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/';
const API_KEY = import.meta.env.VITE_API_KEY || 'your-api-key';
const API_VERSION = import.meta.env.VITE_API_VERSION || '1.0';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'x-api-key': API_KEY,
    'x-api-key-version': API_VERSION,
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const result = await store.dispatch(refreshToken()).unwrap();
        
        // Update token in headers
        if (result.accessToken) {
          originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
          // Retry the original request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout user
        await store.dispatch(logoutUser());
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;