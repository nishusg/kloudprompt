// services/BookmarkService.ts
import { Prompt } from '../models';
import apiClient from './ApiClient';
import { handleApiError } from './UtilsService';

export const getUserBookmarks = async (userId: string): Promise<Prompt[]> => {
  try {
    const { data } = await apiClient.get(`/bookmarks/users/${userId}`);
    return data;
  } catch (err) {
    handleApiError(err, "Failed to fetch user bookmarks");
    return []; // fallback
  }
};
