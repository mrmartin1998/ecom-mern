import axios from 'axios';
import retryConfig from './retryConfig';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with retry logic
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { config } = error;
    
    // Skip retry for specific error codes or methods
    if (!retryConfig.retryCondition(error) || 
        ['POST', 'PUT', 'DELETE'].includes(config.method?.toUpperCase())) {
      return Promise.reject({
        code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
        message: error.response?.data?.error?.message || 'An unexpected error occurred',
        status: error.response?.status || 500,
      });
    }

    config.retryCount = config.retryCount || 0;

    if (config.retryCount >= retryConfig.retries) {
      return Promise.reject({
        code: 'MAX_RETRIES_EXCEEDED',
        message: 'Maximum retry attempts reached',
        status: error.response?.status || 500,
      });
    }

    config.retryCount += 1;

    const delayMs = retryConfig.retryDelay(config.retryCount);
    await new Promise(resolve => setTimeout(resolve, delayMs));

    return apiClient(config);
  }
);

export default apiClient; 