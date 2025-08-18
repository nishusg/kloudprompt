export interface User {
  readonly _id: string;
  userName: string;
  email?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  bookmarkedPrompts?: string[];
}

// DTO for updating user
export interface UpdateUserDto {
  userName?: string;
  email?: string;
  password?: string;
}