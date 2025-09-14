import apiClient from './ApiClient';
import { Prompt, CreatePromptDto, UpdatePromptDto } from '../models/Prompt';
import { handleApiError } from './UtilsService';
import { EnhancePromptRequest, EnhancePromptResponse, LeaderboardResponse } from '../models';
import { ApiError } from '../models/ApiError';
import { RankingFilterEnum } from '../utils/Enum';

interface GetPromptsParams {
  search?: string;
  modelType?: string;
  generationType?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export const getPrompts = async (params: GetPromptsParams = {}): Promise<{ prompts: Prompt[]; total: number; }> => {
  try {
    const response = await apiClient.get('/prompts', {
      params: {
        search: params.search || '',
        modelType: params.modelType || '',
        generationType: params.generationType || '',
        category: params.category || '',
        page: params.page || 1,
        limit: params.limit || 9,
      },
    });

    return response.data.data;
  } catch (err) {
    const message = handleApiError(err, 'Failed to fetch prompts');
    const error: ApiError = { message };
    throw error;
  }
};

export const getPromptsByCategory = async (
  category: string,
  limit: number = 10,
  page: number = 1
): Promise<{prompts: Prompt[], totalPages: string}> => {
  try {
    
    const res = await apiClient.get(`/prompts/category/${category}?limit=${limit}&page=${page}`);
    const { prompts, totalPages } = res.data.data;
    return { prompts, totalPages };
  } catch (err) {
    
    const message = handleApiError(err, "Failed to fetch prompts");
    const error: ApiError = { message };
    throw error;
  }
};

export const getPromptById = async (id: string): Promise<Prompt> => {
  try {
    const response = await apiClient.get(`/prompts/${id}`);
    const promptData = response.data.data.prompt;
    promptData.isBookmarkedByCurrentUser = response.data.data.isBookmarked;
    promptData.normalizeCount = response.data.data.normalizeCount;
    return promptData;
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch prompt");
    const error: ApiError = { message };
    throw error;
  }
};

export const incrementPromptView = async (id: string): Promise<number> => {
  try {
    const response = await apiClient.post(`/prompts/${id}/view`);
    return response.data.data.prompt.views;
  } catch (err) {
    const message = handleApiError(err, "Failed to increment views");
    const error: ApiError = { message };
    throw error;
  }
};

export const getTrendingPrompts = async (limit: number = 10, filter: RankingFilterEnum): Promise<Prompt[]> => {
  try {
    const response = await apiClient.get(`/prompts/trending?limit=${limit}&filter=${filter}`);
    return response.data.data.prompts;
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch trending prompts");
    const error: ApiError = { message };
    throw error;
  }
};

export const getLeaderboard = async (limit: number = 10, filter: RankingFilterEnum): Promise<LeaderboardResponse[]> => {
  try {
    const response = await apiClient.get(`/prompts/leaderboard?limit=${limit}&filter=${filter}`);
    return response.data.data.leaderboards;
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch leaderboard prompts");
    const error: ApiError = { message };
    throw error;
  }
};

export const createPrompt = async (data: CreatePromptDto): Promise<Prompt> => {
  try {
    const response = await apiClient.post("/prompts", data);
    return response.data.data.prompt;
  } catch (err) {
    const message = handleApiError(err, "Failed to create prompt");
    const error: ApiError = { message };
    throw error;
  }
};

export const updatePrompt = async (id: string, data: UpdatePromptDto): Promise<Prompt> => {
  try {
    const response = await apiClient.patch(`/prompts/${id}`, data);
    return response.data.data.prompt;
  } catch (err) {
    const message = handleApiError(err, "Failed to update prompt");
    const error: ApiError = { message };
    throw error;
  }
};

export const deletePrompt = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/prompts/${id}`);
  } catch (err) {
    const message = handleApiError(err, "Failed to delete prompt");
    const error: ApiError = { message };
    throw error;
  }
};

export const toggleBookmarkPrompt = async (id: string): Promise<Prompt> => {
  try {
    const response = await apiClient.patch(`/bookmarks/${id}`);
    return response.data.data;
  } catch (err) {
    const message = handleApiError(err, "Failed to toggle bookmark");
    const error: ApiError = { message };
    throw error;
  }
};

export const enhancePrompt = async (payload: EnhancePromptRequest): Promise<EnhancePromptResponse> => {
  try {
    const res = await apiClient.post(`/prompts/enhance`, payload  );
    return res.data.data as EnhancePromptResponse;
  } catch (err) {
    const message = handleApiError(err, "Failed to enhance prompt");
    throw {message: message};
  }
};