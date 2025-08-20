export { PrismaClient } from "@prisma/client";
export type {
  Company,
  User,
  UserStatus,
  RecruiterProfile,
  Candidate,
  CandidateDocument,
  Skill,
  CandidateSkill,
  Application,
  PipelineStage,
  ApplicationStage,
  Notification,
  Assignment,
  AuditLog,
  OAuthToken,
  ImportSource,
  ImportJob,
  Subscription,
  Plan,
  PasswordResetToken,
  Role,
  CandidateSource,
  SkillCategory,
  AppStatus,
  ImportKind,
  JobStatus,
} from "@prisma/client";

// Re-export commonly used types
export type { Prisma } from "@prisma/client";
