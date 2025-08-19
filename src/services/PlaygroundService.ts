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
