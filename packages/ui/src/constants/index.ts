export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    ME: "/api/auth/me",
    CHANGE_PASSWORD: "/api/auth/change-password",
    REQUEST_RESET: "/api/auth/request-reset",
    RESET_PASSWORD: "/api/auth/reset-password",
  },
  ADMIN: {
    OVERVIEW: "/api/admin/overview",
    USERS: "/api/admin/users",
    COMPANIES: "/api/admin/companies",
    BILLING: "/api/admin/billing",
    SKILLS: "/api/admin/skills",
    ASSIGNMENTS: "/api/admin/assignments",
    IMPORTS: "/api/admin/imports",
    AUDIT: "/api/admin/audit",
    SETTINGS: "/api/admin/settings",
  },
  RECRUITER: {
    CANDIDATES: "/api/recruiter/candidates",
    PIPELINE: "/api/recruiter/pipeline",
    SEARCH: "/api/recruiter/search",
    JOBS: "/api/recruiter/jobs",
    IMPORT: "/api/recruiter/import",
    COMMUNICATIONS: "/api/recruiter/communications",
    NOTIFICATIONS: "/api/recruiter/notifications",
    SETTINGS: "/api/recruiter/settings",
  },
} as const;

export const USER_ROLES = {
  ADMIN: "ADMIN",
  RECRUITER: "RECRUITER",
} as const;

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED",
} as const;

export const SKILL_CATEGORIES = {
  LANG: "LANG",
  FRAMEWORK: "FRAMEWORK",
  DB: "DB",
  CLOUD: "CLOUD",
  TOOL: "TOOL",
  SOFT: "SOFT",
  CERT: "CERT",
  DOMAIN: "DOMAIN",
} as const;

export const CANDIDATE_SOURCES = {
  MANUAL: "MANUAL",
  UPLOAD: "UPLOAD",
  DRIVE: "DRIVE",
  CSV: "CSV",
  EXCEL: "EXCEL",
  AIRTABLE: "AIRTABLE",
  GOOGLE_SHEETS: "GOOGLE_SHEETS",
  ADMIN_ASSIGN: "ADMIN_ASSIGN",
} as const;

export const APP_STATUS = {
  NEW: "NEW",
  SCREENING: "SCREENING",
  INTERVIEW: "INTERVIEW",
  OFFER: "OFFER",
  HIRED: "HIRED",
  REJECTED: "REJECTED",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 20,
  MAX_PER_PAGE: 100,
} as const;

export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: "Logged in successfully",
    LOGOUT: "Logged out successfully",
    SIGNUP: "Account created successfully",
    PASSWORD_CHANGED: "Password changed successfully",
    PASSWORD_RESET_SENT: "Password reset email sent",
    PASSWORD_RESET: "Password reset successfully",
    PROFILE_UPDATED: "Profile updated successfully",
    CANDIDATE_CREATED: "Candidate created successfully",
    CANDIDATE_UPDATED: "Candidate updated successfully",
    CANDIDATE_DELETED: "Candidate deleted successfully",
    JOB_CREATED: "Job created successfully",
    JOB_UPDATED: "Job updated successfully",
    JOB_DELETED: "Job deleted successfully",
    SKILL_CREATED: "Skill created successfully",
    SKILL_UPDATED: "Skill updated successfully",
    SKILL_DELETED: "Skill deleted successfully",
    USER_BLOCKED: "User blocked successfully",
    USER_UNBLOCKED: "User unblocked successfully",
    USER_DELETED: "User deleted successfully",
    TRIAL_EXTENDED: "Trial extended successfully",
  },
  ERROR: {
    LOGIN_FAILED: "Invalid email or password",
    LOGOUT_FAILED: "Failed to logout",
    SIGNUP_FAILED: "Failed to create account",
    PASSWORD_CHANGE_FAILED: "Failed to change password",
    PASSWORD_RESET_FAILED: "Failed to reset password",
    PROFILE_UPDATE_FAILED: "Failed to update profile",
    CANDIDATE_CREATE_FAILED: "Failed to create candidate",
    CANDIDATE_UPDATE_FAILED: "Failed to update candidate",
    CANDIDATE_DELETE_FAILED: "Failed to delete candidate",
    JOB_CREATE_FAILED: "Failed to create job",
    JOB_UPDATE_FAILED: "Failed to update job",
    JOB_DELETE_FAILED: "Failed to delete job",
    SKILL_CREATE_FAILED: "Failed to create skill",
    SKILL_UPDATE_FAILED: "Failed to update skill",
    SKILL_DELETE_FAILED: "Failed to delete skill",
    USER_BLOCK_FAILED: "Failed to block user",
    USER_UNBLOCK_FAILED: "Failed to unblock user",
    USER_DELETE_FAILED: "Failed to delete user",
    TRIAL_EXTEND_FAILED: "Failed to extend trial",
    NETWORK_ERROR: "Network error occurred",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Access forbidden",
    NOT_FOUND: "Resource not found",
    VALIDATION_ERROR: "Validation error",
    SERVER_ERROR: "Server error occurred",
  },
} as const;

export const QUERY_KEYS = {
  AUTH: {
    USER: "auth:user",
    LOGIN: "auth:login",
    SIGNUP: "auth:signup",
    LOGOUT: "auth:logout",
    REFRESH: "auth:refresh",
  },
  ADMIN: {
    OVERVIEW: "admin:overview",
    USERS: "admin:users",
    COMPANIES: "admin:companies",
    BILLING: "admin:billing",
    SKILLS: "admin:skills",
    ASSIGNMENTS: "admin:assignments",
    IMPORTS: "admin:imports",
    AUDIT: "admin:audit",
    SETTINGS: "admin:settings",
  },
  RECRUITER: {
    CANDIDATES: "recruiter:candidates",
    PIPELINE: "recruiter:pipeline",
    SEARCH: "recruiter:search",
    JOBS: "recruiter:jobs",
    IMPORT: "recruiter:import",
    COMMUNICATIONS: "recruiter:communications",
    NOTIFICATIONS: "recruiter:notifications",
    SETTINGS: "recruiter:settings",
    DASHBOARD: "recruiter:dashboard",
  },
} as const;

export const STALE_TIME = {
  SHORT: 1000 * 60, // 1 minute
  MEDIUM: 1000 * 60 * 5, // 5 minutes
  LONG: 1000 * 60 * 30, // 30 minutes
} as const;

export const REFRESH_TOKEN_EXPIRY = 30; // days
export const ACCESS_TOKEN_EXPIRY = "1h";
export const PASSWORD_RESET_EXPIRY = 1; // hour
