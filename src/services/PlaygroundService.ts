// src/services/PlaygroundService.ts
import { ApiError } from '../models/ApiError';
import apiClient from './ApiClient';
import { handleApiError } from './UtilsService';

export interface PlaygroundRequest {
  prompt: string;
  userApiKey: string;
  provider: string;
}

export interface PlaygroundResponse {
  output?: string;
  imageUrl?: string;
  error?: string;
}

export const runPlaygroundPrompt = async (
  payload: PlaygroundRequest
): Promise<PlaygroundResponse> => {
  try {
    const { data } = await apiClient.post<PlaygroundResponse>(
      '/playground/run',
      payload
    );
    return data;
  } catch (err) {
    const message = handleApiError(err, 'Failed to run playground prompt');
    const error: ApiError = { message };
    throw error;
  }
};

export const downloadImageBuffer = async (url: string): Promise<Blob | { error: string }> => {
  try {
    const response = await apiClient.get(`/playground/download`, {
      params: { url },
      responseType: 'blob', // 👈 tell axios to return binary
    });

    return response.data; // this will be a Blob
  } catch (err) {
    const message = handleApiError(err, 'Failed to download image');
    const error: ApiError = { message };
    throw error;
  }
};

