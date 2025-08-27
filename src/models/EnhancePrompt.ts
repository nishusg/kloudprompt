// Request DTO
export interface EnhancePromptRequest {
  provider: string;
  apiKey: string;
  promptContent: string;
}

// Response DTO
export interface EnhancePromptResponse {
  enhancedText: string;
}
