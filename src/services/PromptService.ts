import apiClient from './ApiClient';
import { Prompt, CreatePromptDto, UpdatePromptDto } from '../models/Prompt';
import { handleApiError } from './UtilsService';

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
  try {
    const apiParams: any = { ...params };
    if (params.tags && params.tags.length > 0) {
      apiParams.tags = params.tags.join(',');
    }

    const response = await apiClient.get('/prompts', { params: apiParams });
    return response.data.prompts;
  } catch (err) {
    handleApiError(err, "Failed to fetch prompts");
    return {} as Prompt[]; 
  }
};

export const getPromptById = async (id: string): Promise<Prompt> => {
  try {
    const response = await apiClient.get(`/prompts/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err, "Failed to fetch prompt");
    return {} as Prompt; 
  }
};

export const incrementPromptView = async (id: string): Promise<number> => {
  try {
    const response = await apiClient.post(`/prompts/${id}/view`);
    return response.data.views;
  } catch (err) {
    handleApiError(err, "Failed to increment views");
    return 0;
  }
};

export const getTrendingPrompts = async (limit: number = 10): Promise<Prompt[]> => {
  try {
    const response = await apiClient.get(`/prompts/trending?limit=${limit}`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch trending prompts", err);
    return [];
  }
};

export const getUserPrompts = async (userId: string): Promise<Prompt[]> => {
  try {
    const response = await apiClient.get(`/users/${userId}/prompts`);
    return response.data;
  } catch (err) {
    handleApiError(err, "Failed to fetch user prompts");
    return {} as Prompt[]; 
  }
};

export const createPrompt = async (data: CreatePromptDto): Promise<Prompt> => {
  try {
    const response = await apiClient.post("/prompts", data);
    return response.data;
  } catch (err) {
    handleApiError(err, "Failed to create prompt");
    return {} as Prompt; 
  }
};

export const updatePrompt = async (id: string, data: UpdatePromptDto): Promise<Prompt> => {
  try {
    const response = await apiClient.patch(`/prompts/${id}`, data);
    return response.data;
  } catch (err) {
    handleApiError(err, "Failed to update prompt");
    return {} as Prompt; 
  }
};

export const deletePrompt = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/prompts/${id}`);
  } catch (err) {
    handleApiError(err, "Failed to delete prompt");
  }
};

export const upvotePrompt = async (id: string): Promise<Prompt> => {
  try {
    const response = await apiClient.post(`/prompts/${id}/upvote`);
    return response.data;
  } catch (err) {
    handleApiError(err, "Failed to upvote prompt");
    return {} as Prompt; 
  }
};

export const getPopularTags = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get('/prompts/tags/popular'); // 🔹 better endpoint than `/prompts`
    return response.data;
  } catch (err) {
    handleApiError(err, "Failed to fetch popular tags");
    return {} as string[]; 
  }
};

export const searchPrompts = async (query: string): Promise<Prompt[]> => {
  try {
    const response = await apiClient.get('/prompts/search', { params: { q: query } });
    return response.data;
  } catch (err) {
    handleApiError(err, "Failed to search prompts");
    return {} as Prompt[]; 
  }
};

export const toggleBookmarkPrompt = async (id: string): Promise<Prompt> => {
  try {
    const response = await apiClient.patch(`/bookmarks/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err, "Failed to toggle bookmark");
    return {} as Prompt;
  }
};
