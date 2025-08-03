import apiClient from './ApiClient';
import { PromptComment } from '../models/Comment';

export const getComments = async (promptId: string): Promise<PromptComment[]> => {
  const response = await apiClient.get(`/prompts/${promptId}/comments`);
  return response.data;
};

export const addComment = async (
  promptId: string,
  content: string
): Promise<PromptComment> => {
  const response = await apiClient.post(`/prompts/${promptId}/comments`, { content });
  return response.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await apiClient.delete(`/comments/${commentId}`);
};