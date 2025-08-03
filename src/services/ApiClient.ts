// src/services/ApiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Your API base URL
});

// ✨ Use an interceptor to automatically add the token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;