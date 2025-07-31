import apiClient from './ApiClient';
import { Comment } from '../models/Comment';

export const getComments = async (promptId: string): Promise<Comment[]> => {
  const response = await apiClient.get(`/prompts/${promptId}/comments`);
  return response.data;
};

export const addComment = async (
  promptId: string,
  content: string
): Promise<Comment> => {
  const response = await apiClient.post(`/prompts/${promptId}/comments`, { content });
  return response.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await apiClient.delete(`/comments/${commentId}`);
};