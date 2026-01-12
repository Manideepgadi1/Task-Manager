import axios from 'axios';

const api = axios.create({
  baseURL: '/taskmanager/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if:
    // 1. It's a 401 error
    // 2. We're not already on the login page
    // 3. The error is not from the login endpoint itself
    if (error.response?.status === 401) {
      const isLoginPage = window.location.pathname.includes('/login');
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      
      if (!isLoginPage && !isLoginRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/taskmanager/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
