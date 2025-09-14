import apiClient from './ApiClient';
import { User, UpdateUserDto, UserStats } from '../models/User';
import { Prompt } from '../models/Prompt';
import { handleApiError } from './UtilsService';
import { AuthResponse } from '../context/AuthContext';
import { ApiError } from '../models/ApiError';

export const registerUser = async (data: {
  userName: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/register', data);
    return response.data.data;
  } catch (err) {
    const message = handleApiError(err, "Failed to register user");
    const error: ApiError = { message };
    throw error;
  }
};

export const loginUser = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data.data;
  } catch (err) {
    // Convert backend error to a proper Error
    const message = handleApiError(err, 'Failed to login');
    const error: ApiError = { message };
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } catch (err) {
    // Convert backend error to a proper Error
    const message = handleApiError(err, 'Failed to logout');
    const error: ApiError = { message };
    throw error;
  }
};

export const resetPassword = async (email: string, newPassword: string): Promise<void> => {
  try {
    await apiClient.post('/auth/reset-password', { email, newPassword });
  } catch (err) {
    const message = handleApiError(err, 'Failed to reset password');
    const error: ApiError = { message };
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get('/users/current-user');
    return response.data.data.user;
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch current user");
    const error: ApiError = { message };
    throw error;
  }
};

export const changePassword = async (id: string, currentPassword: string, newPassword: string): Promise<User> => {
  try {
    const response = await apiClient.post(`/users/${id}/change-password`, {currentPassword, newPassword});
    return response.data.data.user;
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch current user");
    const error: ApiError = { message };
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await apiClient.get(`/users/${id}`);
    return response.data.data.user;
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch user");
    const error: ApiError = { message };
    throw error;
  }
};

export const updateUser = async (id: string, data: UpdateUserDto): Promise<User> => {
  try {
    const response = await apiClient.patch(`/users/${id}/update`, data);
    return response.data.data.user;
  } catch (err) {
    const message = handleApiError(err, "Failed to update user");
    const error: ApiError = { message };
    throw error;
  }
};

export const getUserPrompts = async (
  userId: string,
  page: number = 1,
  limit: number = 5
): Promise<{ prompts: Prompt[]; totalPages: number }> => {
  try {
    const response = await apiClient.get(`/users/${userId}/prompts`, {
      params: { page, limit },
    });

    const data = response.data.data;

    return {
      prompts: data.prompts || [],
      totalPages: data.totalPages || 1, // backend should return total pages
    };
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch user prompts");
    const error: ApiError = { message };
    throw error;
  }
};

export const getUserStats = async (userId: string): Promise<UserStats> => {
  try {
    const response = await apiClient.get(`/users/${userId}/userStats`);
    return response.data.data.stats;
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch user prompts");
    const error: ApiError = { message };
    throw error;
  }
};

export const searchUsers = async (
  username: string,
  page: number = 1,
  limit: number = 10
): Promise<{ users: User[]; totalUsers: number; }> => {
  try {
    const res = await apiClient.get(`/users/search/${username}`, {
      params: { page, limit },
    });
    const data = res.data.data;
    return {
      users: data.users || [],
      totalUsers: data.totalUsers || 1,
    };
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch users");
    throw { message };
  }
};

