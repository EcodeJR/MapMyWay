// frontend/src/services/api.js
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_NODE_ENV === 'production' 
    ? '/api'  // Production: relative path for Vercel
    : 'http://localhost:5000/api', // Development: your local backend
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors like 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Clear invalid auth tokens
      localStorage.removeItem('token');
      // You could redirect to login if needed
    }
    return Promise.reject(error);
  }
);

export default api;