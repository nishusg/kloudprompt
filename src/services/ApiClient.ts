// src/services/ApiClient.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { handleApiError } from './UtilsService';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: REACT_APP_API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔹 Refresh token endpoint (adjust path if different in your API)
const refreshTokenEndpoint = "/auth/refresh-token";
const Access_Token_Key = 'accessToken';
const Refresh_Token_Key = 'refreshToken';

// Flag + queue for refresh handling
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

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

// Request interceptor → attach access token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(Access_Token_Key);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If unauthorized and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem(Refresh_Token_Key);
      if (!refreshToken) {
        localStorage.removeItem(Access_Token_Key);
        localStorage.removeItem(Refresh_Token_Key);
        return Promise.reject(error);
      }

      // Queue requests while refreshing
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(`${REACT_APP_API_URL}${refreshTokenEndpoint}`, { refreshToken });

        const newAccessToken = res.data.data.accessToken;
        const newRefreshToken = res.data.data.refreshToken;

        localStorage.setItem(Access_Token_Key, newAccessToken);
        localStorage.setItem(Refresh_Token_Key, newRefreshToken);

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem(Access_Token_Key);
        localStorage.removeItem(Refresh_Token_Key);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Log nicely
    const message = handleApiError(error, "API request failed");
    console.error("[API ERROR]", message, error.config?.url);

    return Promise.reject(error);
  }
);

export default apiClient;
