import apiClient from './ApiClient';
import { User, UpdateUserDto } from '../models/User';
import { Prompt } from '../models/Prompt';
import { handleApiError } from './UtilsService';
import { AuthResponse } from '../context/AuthContext';

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
    throw new Error(message);
  }
};

export const loginUser = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data.data;
  } catch (err) {
    // Convert backend error to a proper Error
    const message = handleApiError(err, 'Failed to login');
    throw new Error(message);
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } catch (err) {
    // Convert backend error to a proper Error
    const message = handleApiError(err, 'Failed to logout');
    throw new Error(message);
  }
};

export const resetPassword = async (email: string, newPassword: string): Promise<void> => {
  try {
    await apiClient.post('/auth/reset-password', { email, newPassword });
  } catch (err) {
    const message = handleApiError(err, 'Failed to reset password');
    throw new Error(message);
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get('/users/current-user');
    return response.data.data.user;
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch current user");
    throw new Error(message);
  }
};

export const changePassword = async (id: string, currentPassword: string, newPassword: string): Promise<User> => {
  try {
    const response = await apiClient.post(`/users/${id}/change-password`, {currentPassword, newPassword});
    return response.data.data.user;
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch current user");
    throw new Error(message);
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await apiClient.get(`/users/${id}`);
    return response.data.data.user;
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch user");
    throw new Error(message);
  }
};

export const updateUser = async (id: string, data: UpdateUserDto): Promise<User> => {
  try {
    const response = await apiClient.patch(`/users/${id}/update`, data);
    return response.data.data.user;
  } catch (err) {
    const message = handleApiError(err, "Failed to update user");
    throw new Error(message);
  }
};

export const getUserPrompts = async (userId: string): Promise<Prompt[]> => {
  try {
    const response = await apiClient.get(`/users/${userId}/prompts`);
    return response.data.data.prompts;
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch user prompts");
    throw new Error(message);
  }
};
