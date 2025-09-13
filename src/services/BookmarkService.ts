// services/BookmarkService.ts
import { Prompt } from '../models';
import { ApiError } from '../models/ApiError';
import apiClient from './ApiClient';
import { handleApiError } from './UtilsService';

export const getUserBookmarks = async (
  userId: string,
  page: number = 1,
  limit: number = 5
): Promise<{ prompts: Prompt[]; totalPages: number }> => {
  try {
    const response = await apiClient.get(`/bookmarks/users/${userId}`, {
      params: { page, limit },
    });

    const data = response.data.data;

    return {
      prompts: data.bookmarkedPrompts || [],
      totalPages: data.totalPages || 1, // backend should return total pages
    };
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch user bookmarks");
    const error: ApiError = { message };
    throw error;
  }
};
