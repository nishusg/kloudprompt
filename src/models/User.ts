export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  password?: string;
}