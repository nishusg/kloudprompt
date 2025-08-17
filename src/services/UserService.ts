import apiClient from './ApiClient';
import { User, UpdateUserDto } from '../models/User';
import { Prompt } from '../models/Prompt';
import { handleApiError } from './UtilsService';

export const registerUser = async (data: {
  userName: string;
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> => {
  try {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  } catch (err) {
    handleApiError(err, "Failed to register user");
    return { user: {} as User, token: "" }; // fallback
  }
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (err) {
    handleApiError(err, "Failed to login");
    return { user: {} as User, token: "" }; // fallback
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (err) {
    handleApiError(err, "Failed to fetch current user");
    return {} as User; // fallback
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err, "Failed to fetch user");
    return {} as User; // fallback
  }
};

export const updateUser = async (id: string, data: UpdateUserDto): Promise<User> => {
  try {
    const response = await apiClient.patch(`/users/${id}`, data);
    return response.data;
  } catch (err) {
    handleApiError(err, "Failed to update user");
    return {} as User; // fallback
  }
};

export const getUserPrompts = async (userId: string): Promise<Prompt[]> => {
  try {
    const response = await apiClient.get(`/users/${userId}/prompts`);
    return response.data;
  } catch (err) {
    handleApiError(err, "Failed to fetch user prompts");
    return []; // fallback
  }
};
