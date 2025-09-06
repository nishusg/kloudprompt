import { VerificationStatus } from "../utils/Enum";

export interface User {
  readonly _id: string;
  userName: string;
  email?: string;
  fullName?: string;
  phone?: string;
  bio?: string;
  socialLinks?: { [key: string]: string };
  readonly createdAt: Date;
  readonly updatedAt: Date;
  bookmarkedPrompts?: string[];
  verificationStatus: VerificationStatus;
}

// DTO for updating user
export interface UpdateUserDto {
  userName?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  bio?: string;
  socialLinks?: { [key: string]: string };
}

export interface UserStats{
    totalPrompts: string,
    totalViews: string
}