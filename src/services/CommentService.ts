// src/services/CommentService.ts
import apiClient from "./ApiClient";
import { PromptComment } from "../models/Comment";
import { handleApiError } from "./UtilsService";

// 🔹 Fetch comments with pagination
export const getComments = async (
  promptId: string,
  page: number = 1,
  limit: number = 5
): Promise<{ comments: PromptComment[]; totalCount: number }> => {
  try {
    const response = await apiClient.get(`/comments/${promptId}`, {
      params: { page, limit }, // ✅ query params for pagination
    });

    const comments: PromptComment[] = response.data.data.comments;
    const totalCount: number = response.data.data.totalCount;
    return { comments, totalCount};
  } catch (err) {
    const message = handleApiError(err, "Failed to fetch comments");
    throw new Error(message);
  }
};

// 🔹 Add a new comment
export const addCommentToPrompt = async (
  promptId: string,
  content: string
): Promise<PromptComment> => {
  try {
    const response = await apiClient.post(`/comments/${promptId}`, {
      content,
    });

    return response.data.data.comment;
  } catch (err) {
    const message = handleApiError(err, "Failed to add comment");
    throw new Error(message);
  }
};

// 🔹 Delete a comment by ID
export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    await apiClient.delete(`/comments/${commentId}`);
  } catch (err) {
    const message = handleApiError(err, "Failed to delete comment");
    throw new Error(message);
  }
};
