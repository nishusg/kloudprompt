// ===== Enums =====
export enum ProviderTypeEnum {
  GEMINI = 'gemini',
  CHATGPT = 'chatgpt',
  GROK = 'grok',
  OPENROUTER = 'openrouter',
  TOGETHER = 'together',
}

export enum GenerationTypeEnum {
  IMAGE = 'image',
  VIDEO = 'video',
  TEXT = 'text',
  AUDIO = 'audio',
}

export enum VerificationStatus {
  Pending = "pending",
  Verified = "verified"
}

export enum OTPPurpose {
  Register = "register",
  Forgot = "forgot",
}