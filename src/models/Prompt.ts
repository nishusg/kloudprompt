import { User } from './User';

export interface Prompt {
  id: string;
  title: string;
  content: string;
  description: string;
  tags: string[];
  author: User;
  upvotes: number;
  upvoted: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  examples?: Example[];
  parameters?: Parameter[];
}

export interface CreatePromptDto {
  title: string;
  content: string;
  description: string;
  tags: string[];
  examples?: Example[];
  parameters?: Parameter[];
}

export interface UpdatePromptDto extends Partial<CreatePromptDto> {}

export interface Example {
  input: string;
  output: string;
}

export interface Parameter {
  name: string;
  description: string;
  defaultValue: string;
  required: boolean;
}