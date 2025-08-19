// src/services/ApiClient.ts
import axios from 'axios';
import { API_URL } from '../utils/Constants';

const apiClient = axios.create({
  baseURL: API_URL, // 🔹 configurable via env
  timeout: 60000, // ⏱️ 1m timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✨ Request interceptor → attach token
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

// ✨ Response interceptor → handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken'); // 🔹 clear token
      // Optionally redirect to login page
      // window.location.href = '/login';
    }
    console.error("API Error:", error); // 🔹 central log
    return Promise.reject(error);
  }
);

export default apiClient;
