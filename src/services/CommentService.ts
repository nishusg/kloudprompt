import apiClient from './ApiClient';
import { PromptComment } from '../models/Comment';
import { handleApiError } from './UtilsService';

export const getComments = async (promptId: string): Promise<PromptComment[]> => {
  try {
    const response = await apiClient.get(`/prompts/${promptId}/comments`);
    return response.data;
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch comments");
    throw new Error(message);
  }
};

export const addCommentToPrompt = async (
  promptId: string,
  content: string
): Promise<PromptComment> => {
  try {
    const response = await apiClient.post(`/prompts/${promptId}/comments`, { content });
    return response.data;
  } catch (err) {
    const message = handleApiError(err, "Failed to add comment");
    throw new Error(message);
  }
};

export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    await apiClient.delete(`/comments/${commentId}`);
  } catch (err) {
    const message = handleApiError(err, "Failed to delete comment");
    throw new Error(message);
  }
};
