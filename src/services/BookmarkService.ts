// services/BookmarkService.ts
import { Prompt } from '../models';
import apiClient from './ApiClient';

export const getUserBookmarks = async (userId: string): Promise<Prompt[]> => {
  const { data } = await apiClient.get(`/bookmarks/users/${userId}`);
  return data;
};
