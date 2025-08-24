import { z } from "zod";

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["ADMIN", "RECRUITER"]),
  companyName: z.string().optional(),
  companySlug: z.string().optional(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const setNewPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

// Admin Schemas
export const blockUserSchema = z.object({
  userId: z.string().uuid(),
});

export const unblockUserSchema = z.object({
  userId: z.string().uuid(),
});

export const deleteUserSchema = z.object({
  userId: z.string().uuid(),
});

export const extendTrialSchema = z.object({
  userId: z.string().uuid(),
  days: z.number().min(1).max(365),
});

// Candidate Schemas
export const createCandidateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.number().min(0).optional(),
  source: z.enum([
    "MANUAL",
    "UPLOAD",
    "DRIVE",
    "CSV",
    "EXCEL",
    "AIRTABLE",
    "GOOGLE_SHEETS",
    "ADMIN_ASSIGN",
  ]),
  notes: z.string().optional(),
});

export const updateCandidateSchema = createCandidateSchema.partial();

// Company Schemas
export const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  slug: z.string().min(1, "Company slug is required"),
});

export const updateCompanySchema = createCompanySchema.partial();

// TypeScript Types
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type SetNewPasswordFormData = z.infer<typeof setNewPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export type BlockUserData = z.infer<typeof blockUserSchema>;
export type UnblockUserData = z.infer<typeof unblockUserSchema>;
export type DeleteUserData = z.infer<typeof deleteUserSchema>;
export type ExtendTrialData = z.infer<typeof extendTrialSchema>;

export type CreateCandidateData = z.infer<typeof createCandidateSchema>;
export type UpdateCandidateData = z.infer<typeof updateCandidateSchema>;

export type CreateCompanyData = z.infer<typeof createCompanySchema>;
export type UpdateCompanyData = z.infer<typeof updateCompanySchema>;

// API Response Types
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN" | "RECRUITER";
  companyId?: string;
  company?: {
    id: string;
    name: string;
    slug: string;
  };
  status: "ACTIVE" | "BLOCKED" | "DELETED";
  trialEndsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: AuthUser;
}

export interface AdminMetrics {
  totalUsers: number;
  totalCandidates: number;
  totalCompanies: number;
  activeTrials: number;
  importJobsRunning: number;
  importJobsFailed: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "RECRUITER";
  company?: {
    id: string;
    name: string;
  };
  status?: {
    isBlocked: boolean;
    isDeleted: boolean;
    restrictedUntil?: string;
  };
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  meta: Record<string, unknown>;
  createdAt: string;
  actor: {
    name: string;
    email: string;
  };
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  userCount: number;
  users: {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "RECRUITER";
  }[];
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  skills: string[];
  experience?: number;
  source: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Form Error Types
export interface FormErrors {
  [key: string]: string | undefined;
}

// API Error Types
export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Admin: Skills
export const createSkillSchema = z.object({
  slug: z.string().min(1),
  label: z.string().min(1),
  category: z.enum([
    "LANG",
    "FRAMEWORK",
    "DB",
    "CLOUD",
    "TOOL",
    "SOFT",
    "CERT",
    "DOMAIN",
  ]),
});

export const updateSkillSchema = createSkillSchema.partial();
export type CreateSkillData = z.infer<typeof createSkillSchema>;
export type UpdateSkillData = z.infer<typeof updateSkillSchema>;

export interface Skill {
  id: string;
  slug: string;
  label: string;
  category: CreateSkillData["category"];
}

// Admin: Import Jobs
export interface ImportJob {
  id: string;
  status: string;
  source?: string;
  error?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Recruiter: Pipeline
export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
  applications: PipelineApplication[];
}

export interface PipelineApplication {
  id: string;
  application: {
    id: string;
    candidate: Candidate;
    createdAt: string;
  };
}

export interface Application {
  id: string;
  candidate: Candidate;
  stages: {
    stage: {
      id: string;
      name: string;
      color: string;
    };
  }[];
  createdAt: string;
}

// Recruiter: Dashboard Metrics
export interface RecruiterMetrics {
  totalCandidates: number;
  activeApplications: number;
  interviewsScheduled: number;
  offersExtended: number;
  recentActivity: {
    id: string;
    action: string;
    candidateName: string;
    timestamp: string;
  }[];
}

// Recruiter: Search
export interface SearchResult {
  candidates: Candidate[];
  skills: Skill[];
}

// Additional Recruiter Types
export interface CandidateWithCounts {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  experienceLevel?: string;
  source: string;
  createdAt: Date;
  _count: {
    skills: number;
    documents: number;
  };
}

export interface CandidateDetail {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  experienceLevel?: string;
  headline?: string;
  summary?: string;
  source: string;
  createdAt: Date;
  documents: Array<{
    id: string;
    originalName: string;
    mimeType: string;
    size: number;
  }>;
  skills: Array<{
    id: string;
    skill: {
      id: string;
      name: string;
    };
    proficiency?: string;
  }>;
  applications: Array<{
    id: string;
    job: {
      id: string;
      title: string;
    };
    stages: Array<{
      stage: {
        id: string;
        name: string;
      };
    }>;
  }>;
}

export interface Job {
  id: string;
  title: string;
  location?: string;
  seniority?: string;
  salaryMin?: number;
  salaryMax?: number;
  type?: string;
  jdMarkdown?: string;
  status: string;
  applicationsCount: number;
  createdAt: Date;
}

export interface PipelineData {
  stages: Array<{
    id: string;
    name: string;
    order: number;
  }>;
  columns: Record<
    string,
    Array<{
      id: string;
      candidate: {
        id: string;
        name: string;
        email?: string;
      };
      stages: Array<{
        stageId: string;
        stage: {
          id: string;
          name: string;
        };
      }>;
      createdAt: Date;
    }>
  >;
}
