// src/services/PlaygroundService.ts
import apiClient from './ApiClient';
import { handleApiError } from './UtilsService';

export interface PlaygroundRequest {
  prompt: string;
  userApiKey: string;
  provider: 'chatgpt' | 'gemini' | 'openrouter' | 'grok' | 'together';
  model: string;
  type?: 'text'|'image'|'video'|'audio';
  temperature?: number;
  maxTokens?: number;
  size?: '256x256' | '512x512' | '1024x1024';
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
    return { error: 'Something went wrong while running prompt' };
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
    return { error: 'Something went wrong while downloading image' };
  }
};

