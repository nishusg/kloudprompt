import { User } from './User';

export interface PromptComment {
  readonly _id: string;
  text: string;
  readonly userId: User;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly parentId?: string | null;
}