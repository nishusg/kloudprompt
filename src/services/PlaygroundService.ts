// src/services/PlaygroundService.ts
import apiClient from './ApiClient';
import { handleApiError } from './UtilsService';

export interface PlaygroundRequest {
  prompt: string;
  userApiKey: string;
  provider: 'chatgpt' | 'gemini' | 'openrouter' | 'grok' | 'together';
  type?: 'text'|'image'|'video'|'audio';
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
    handleApiError(err, 'Failed to run playground prompt');
    return {} as PlaygroundResponse; // fallback
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
    handleApiError(err, 'Failed to download image');
    return {} as { error: string }; // fallback
  }
};

