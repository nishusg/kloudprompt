import { PromptComment } from './Comment';
import { GenerationTypeEnum, ProviderTypeEnum } from './Enum';
import { User } from './User';

export interface Prompt {
  readonly _id: string;
  title: string;
  content: string;
  description: string;
  modelType: ProviderTypeEnum;
  generationType: GenerationTypeEnum;
  tags: string[];
  readonly author: User;
  readonly views: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
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
}

export interface UpdatePromptDto extends Partial<CreatePromptDto> {}
