export interface User {
  readonly _id: string; // Renamed from _id for consistency
  username: string;
  email?: string; // Optional: likely only present for the logged-in user
  avatar?: string;
  bio?: string;
  readonly followersCount?: number;
  readonly followingCount?: number;
  isFollowing?: boolean; // Dynamic based on viewer
  readonly createdAt: Date; // Use Date object
  readonly updatedAt: Date;
}

// No changes needed, this DTO is well-defined for updates.
export interface UpdateUserDto {
  username?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  password?: string;
}