import { User } from './User';

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  parentId?: string | null;
}