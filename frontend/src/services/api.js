import axios from 'axios';

const BASE_URL = import.meta.env.VITE_NODE_ENV === 'production'
  ? 'https://map-my-way-backend.vercel.app'  // Production backend URL
  : 'http://localhost:5000'; // Development backend URL

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Helper method to get complete image URL
api.getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  try {
    // If it's already a full URL, return it
    new URL(imageUrl);
    return imageUrl;
  } catch {
    // If it's a relative path, prepend the API base URL
    return `${api.defaults.baseURL}/uploads/file/${imageUrl.split('/').pop()}`;
  }
};

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