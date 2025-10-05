import { PromptComment } from './Comment';
import { GenerationTypeEnum, PromptCategoryEnum, ProviderTypeEnum } from '../utils/Enum';
import { User } from './User';

export interface Prompt {
  readonly _id: string;
  title: string;
  content: string;
  description: string;
  modelType: ProviderTypeEnum;
  generationType: GenerationTypeEnum;
  category: PromptCategoryEnum;
  tags: string[];
  promptUrl: string;
  readonly author: User;
  readonly views: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly normalizeCount?: string;
  commentIds: PromptComment[];
  isBookmarkedByCurrentUser: any;
}

// ✅ DTOs remain same
export interface CreatePromptDto {
  title: string;
  content: string;
  description: string;
  tags: string[];
  modelType: ProviderTypeEnum;
  generationType: GenerationTypeEnum;
  category: PromptCategoryEnum;
  promptUrl: string;
  promptImage: File;
}

export interface UpdatePromptDto extends Partial<CreatePromptDto> {}
