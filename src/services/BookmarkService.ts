// services/BookmarkService.ts
import { Prompt } from '../models';
import apiClient from './ApiClient';
import { handleApiError } from './UtilsService';

export const getUserBookmarks = async (userId: string): Promise<Prompt[]> => {
  try {
    const response = await apiClient.get(`/bookmarks/users/${userId}`);
    return response.data.data.bookmarkedPrompts;
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch user bookmarks");
    throw new Error(message);
  }
};
