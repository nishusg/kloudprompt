import { PromptComment } from './Comment';
import { GenerationTypeEnum, ModelTypeEnum } from './Enum';
import { User } from './User';

export interface Prompt {
  readonly _id: string;
  title: string;
  content: string;
  description: string;
  modelType: ModelTypeEnum;
  generationType: GenerationTypeEnum;
  tags: string[];
  readonly author: User;
  readonly views: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  comments: PromptComment[];
  isBookmarkedByCurrentUser: any;
}

// ✅ DTOs remain same
export interface CreatePromptDto {
  title: string;
  content: string;
  description: string;
  tags: string[];
  modelType: ModelTypeEnum;
  generationType: GenerationTypeEnum;
}

export interface UpdatePromptDto extends Partial<CreatePromptDto> {}
