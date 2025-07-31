import apiClient from './ApiClient';
import { Prompt, CreatePromptDto, UpdatePromptDto } from '../models/Prompt';

export const getPrompts = async (params?: {
  search?: string;
  tags?: string[];
  sort?: string;
  limit?: number;
}): Promise<Prompt[]> => {
  const response = await apiClient.get('/prompts', { params });
  return response.data;
};

export const getPromptById = async (id: string): Promise<Prompt> => {
  const response = await apiClient.get(`/prompts/${id}`);
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
  const response = await apiClient.get('/prompts/tags/popular');
  return response.data;
};

export const searchPrompts = async (query: string): Promise<Prompt[]> => {
  const response = await apiClient.get('/prompts/search', { params: { q: query } });
  return response.data;
};