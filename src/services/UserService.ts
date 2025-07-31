import apiClient from './ApiClient';
import { User, UpdateUserDto } from '../models/User';
import { Prompt } from '../models/Prompt';

export const registerUser = async (data: {
  username: string;
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get('/users/me');
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id: string, data: UpdateUserDto): Promise<User> => {
  const response = await apiClient.patch(`/users/${id}`, data);
  return response.data;
};

export const followUser = async (userId: string): Promise<void> => {
  await apiClient.post(`/users/${userId}/follow`);
};

export const unfollowUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}/follow`);
};

export const getUserPrompts = async (userId: string): Promise<Prompt[]> => {
  const response = await apiClient.get(`/users/${userId}/prompts`);
  return response.data;
};