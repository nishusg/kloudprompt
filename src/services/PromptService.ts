import apiClient from './ApiClient';
import { Prompt, CreatePromptDto, UpdatePromptDto } from '../models/Prompt';

// ✨ Define a type for the paginated API response
export interface PaginatedPrompts {
  data: Prompt[];
  page: number;
  totalPages: number;
  totalPrompts: number;
}

export const getPrompts = async (params: {
  search?: string;
  tags?: string[];
  sort?: string;
  limit?: number;
  page?: number;
} = {}): Promise<Prompt[]> => {

  // ✨ Create a copy of params to modify
  const apiParams: any = { ...params };

  // 1. Convert the tags array to a comma-separated string
  if (params.tags && params.tags.length > 0) {
    apiParams.tags = params.tags.join(',');
  }

  const response = await apiClient.get('/prompts', { params: apiParams });
  
  // 2. Return the entire data object from the response
  return response.data.prompts; // Assuming the API returns a 'prompts' field with the array of prompts
};

export const getPromptById = async (id: string): Promise<Prompt> => {
  const response = await apiClient.get(`/prompts/${id}`);
  return response.data;
};

// ✅ ADD THIS NEW FUNCTION HERE
export const getUserPrompts = async (userId: string): Promise<Prompt[]> => {
  const response = await apiClient.get(`/users/${userId}/prompts`);
  return response.data;
};

export const createPrompt = async (data: CreatePromptDto): Promise<Prompt> => {
  const response = await apiClient.post('/prompts', data);
  return response.data;
};

export const updatePrompt = async (id: string, data: UpdatePromptDto): Promise<Prompt> => {
  const response = await apiClient.patch(`/prompts/${id}`, data);
  return response.data;
};

export const deletePrompt = async (id: string): Promise<void> => {
  await apiClient.delete(`/prompts/${id}`);
};

export const upvotePrompt = async (id: string): Promise<Prompt> => {
  const response = await apiClient.post(`/prompts/${id}/upvote`);
  return response.data;
};

export const getPopularTags = async (): Promise<string[]> => {
  const response = await apiClient.get('/prompts');
  return response.data;
};

export const searchPrompts = async (query: string): Promise<Prompt[]> => {
  const response = await apiClient.get('/prompts/search', { params: { q: query } });
  return response.data;
};