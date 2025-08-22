import { User, Company } from "@amy/db";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN" | "RECRUITER";
  companyId?: string;
  company?: Company;
  status: "ACTIVE" | "BLOCKED" | "DELETED";
  trialEndsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role: "ADMIN" | "RECRUITER";
  companyName?: string;
  companySlug?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface PasswordResetToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export type { PasswordResetToken as RefreshToken };
