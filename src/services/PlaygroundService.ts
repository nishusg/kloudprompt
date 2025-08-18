interface PlaygroundRequest {
  prompt: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

// Returns EventSource for streaming
export const runPlaygroundPrompt = (data: PlaygroundRequest): EventSource => {
  const query = new URLSearchParams(data as any).toString();
  return new EventSource(`/api/playground/run?${query}`);
};
