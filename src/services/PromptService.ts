import apiClient from './ApiClient';
import { Prompt, CreatePromptDto, UpdatePromptDto } from '../models/Prompt';
import { handleApiError } from './UtilsService';
import { EnhancePromptRequest, EnhancePromptResponse, LeaderboardResponse } from '../models';

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

    return response.data.data.prompts.prompts;
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch prompts");
    throw new Error(message);
  }
};

export const getPromptById = async (id: string): Promise<Prompt> => {
  try {
    const response = await apiClient.get(`/prompts/${id}`);
    const promptData = response.data.data.prompt;
    promptData.isBookmarkedByCurrentUser = response.data.data.isBookmarked;
    return promptData;
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch prompt");
    throw new Error(message);
  }
};

export const incrementPromptView = async (id: string): Promise<number> => {
  try {
    const response = await apiClient.post(`/prompts/${id}/view`);
    return response.data.data.prompt.views;
  } catch (err) {
    const message = handleApiError(err, "Failed to increment views");
    throw new Error(message);
  }
};

export const getTrendingPrompts = async (limit: number = 10): Promise<Prompt[]> => {
  try {
    const response = await apiClient.get(`/prompts/trending?limit=${limit}`);
    return response.data.data.prompts;
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch trending prompts");
    throw new Error(message);
  }
};

export const getLeaderboard = async (limit: number = 10): Promise<LeaderboardResponse[]> => {
  try {
    const response = await apiClient.get(`/prompts/leaderboard?limit=${limit}`);
    return response.data.data.leaderboards;
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch leaderboard prompts");
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

export const createPrompt = async (data: CreatePromptDto): Promise<Prompt> => {
  try {
    const response = await apiClient.post("/prompts", data);
    return response.data.data.prompt;
  } catch (err) {
    const message = handleApiError(err, "Failed to create prompt");
    throw new Error(message);
  }
};

export const updatePrompt = async (id: string, data: UpdatePromptDto): Promise<Prompt> => {
  try {
    const response = await apiClient.patch(`/prompts/${id}`, data);
    return response.data.data.prompt;
  } catch (err) {
    const message = handleApiError(err, "Failed to update prompt");
    throw new Error(message);
  }
};

export const deletePrompt = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/prompts/${id}`);
  } catch (err) {
    const message = handleApiError(err, "Failed to delete prompt");
    throw new Error(message);
  }
};

export const toggleBookmarkPrompt = async (id: string): Promise<Prompt> => {
  try {
    const response = await apiClient.patch(`/bookmarks/${id}`);
    return response.data.data;
  } catch (err) {
    const message = handleApiError(err, "Failed to toggle bookmark");
    throw new Error(message);
  }
};

export const enhancePrompt = async (payload: EnhancePromptRequest): Promise<EnhancePromptResponse> => {
  const res = await apiClient.post(`/prompts/enhance`, payload  );
  return res.data.data as EnhancePromptResponse;
};