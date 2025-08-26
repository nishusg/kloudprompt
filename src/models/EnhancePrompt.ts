// Request DTO
export interface EnhancePromptRequest {
  model: string;
  apiKey: string;
  promptContent: string;
}

// Response DTO
export interface EnhancePromptResponse {
  enhancedText: string;
}
