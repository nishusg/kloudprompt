export interface User {
  readonly _id: string; // Renamed from _id for consistency
  userName: string;
  email?: string; // Optional: likely only present for the logged-in user
  readonly createdAt: Date; // Use Date object
  readonly updatedAt: Date;
}

// No changes needed, this DTO is well-defined for updates.
export interface UpdateUserDto {
  userName?: string;
  email?: string;
  password?: string;
}