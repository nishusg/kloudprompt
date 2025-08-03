import { PromptComment } from './Comment';
import { User } from './User';

export interface Prompt {
  readonly _id: string;
  title: string;
  promptText: string; // Corrected from 'content'
  description: string;
  tags: string[];
  readonly author: User;
  readonly upvotes: number;
  isUpvotedByCurrentUser: boolean;
  readonly views: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  comments: PromptComment[];
  examples?: Example[];
  parameters?: Parameter[];
}

// No changes needed, this is well-defined
export interface CreatePromptDto {
  title: string;
  content: string;
  description: string;
  tags: string[];
  examples?: Example[];
  parameters?: Parameter[];
}

// No changes needed, this is an excellent use of TypeScript's Partial
export interface UpdatePromptDto extends Partial<CreatePromptDto> {}

export interface Example {
  readonly input: string;
  readonly output: string;
}

export interface Parameter {
  readonly name: string;
  readonly description: string;
  readonly defaultValue: string;
  readonly required: boolean;
}