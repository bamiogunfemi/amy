export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SearchFilters {
  query?: string;
  skills?: string[];
  experience?: number;
  source?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface FileUploadResponse {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface ImportJobStatus {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  totalRecords: number;
  processedRecords: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationData {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface AuditLogData {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  meta: Record<string, unknown>;
  createdAt: Date;
  actor: {
    id: string;
    name: string;
    email: string;
  };
}

export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  response?: {
    data?: {
      error?: string;
    };
  };
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

export interface RefreshTokenData {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface SubscriptionData {
  id: string;
  planId: string;
  status: "active" | "past_due" | "canceled";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEndsAt?: Date;
}

export interface PlanData {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  features: string[];
  limits: Record<string, number>;
}

export interface CompanyData {
  id: string;
  name: string;
  slug: string;
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileData {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "RECRUITER";
  companyId?: string;
  company?: CompanyData;
  status: "ACTIVE" | "BLOCKED" | "DELETED";
  trialEndsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CandidateData {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  location?: string;
  experienceLevel?: string;
  headline?: string;
  summary?: string;
  source: string;
  ownerRecruiterId: string;
  createdAt: Date;
  updatedAt: Date;
  skills: SkillData[];
}

export interface JobData {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  status: "draft" | "published" | "closed";
  ownerRecruiterId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationData {
  id: string;
  candidateId: string;
  jobId: string;
  status: "NEW" | "SCREENING" | "INTERVIEW" | "OFFER" | "HIRED" | "REJECTED";
  currentStageId: string;
  createdAt: Date;
  updatedAt: Date;
  candidate: CandidateData;
  job: JobData;
}

export interface PipelineStageData {
  id: string;
  name: string;
  order: number;
  color: string;
  applications: ApplicationData[];
  ownerRecruiterId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PipelineData {
  stages: PipelineStageData[];
  totalApplications: number;
  totalCandidates: number;
  totalJobs: number;
}

export interface DashboardMetrics {
  totalCandidates: number;
  totalJobs: number;
  totalApplications: number;
  activeJobs: number;
  recentApplications: number;
  pipelineStages: PipelineStageData[];
}

export interface SearchResult {
  candidates: CandidateData[];
  jobs: JobData[];
  total: number;
  page: number;
  perPage: number;
}

export interface SkillData {
  id: string;
  label: string; // API returns 'label' for skill name
  category: string;
  slug: string;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunicationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: "email" | "sms";
  ownerRecruiterId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailCampaign {
  id: string;
  name: string;
  templateId: string;
  recipients: string[];
  status: "draft" | "scheduled" | "sending" | "sent" | "failed";
  scheduledAt?: Date;
  sentAt?: Date;
  ownerRecruiterId: string;
  createdAt: Date;
  updatedAt: Date;
}
