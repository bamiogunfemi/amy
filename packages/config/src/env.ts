import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  SESSION_SECRET: z
    .string()
    .min(1)
    .default("amy-dev-session-secret-key-2024-change-in-production"),

  // Database
  DATABASE_URL: z
    .string()
    .url()
    .default("postgresql://amy:amy@localhost:5432/amy"),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().url().optional(),

  // Google Drive
  GOOGLE_DRIVE_SCOPE: z
    .string()
    .default("https://www.googleapis.com/auth/drive.readonly"),

  // Airtable
  AIRTABLE_PAT: z.string().optional(),

  // Google Sheets
  GOOGLE_SHEETS_AUTH: z.enum(["oauth", "service"]).default("oauth"),
  GOOGLE_SERVICE_ACCOUNT_JSON_BASE64: z.string().optional(),

  // Storage
  S3_ENDPOINT: z.string().url().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_REGION: z.string().default("us-east-1"),

  // Mail
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),

  // Plans & Limits
  TRIAL_DAYS_DEFAULT: z.string().transform(Number).default("14"),
  FREE_CANDIDATE_LIMIT: z.string().transform(Number).default("200"),
  DAILY_IMPORT_LIMIT: z.string().transform(Number).default("300"),

  // Redis
  REDIS_URL: z.string().url().optional(),

  // Security
  JWT_SECRET: z
    .string()
    .default("amy-dev-jwt-secret-key-2024-change-in-production"),
  COOKIE_SECRET: z
    .string()
    .default("amy-dev-cookie-secret-key-2024-change-in-production"),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default("900000"),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default("100"),

  // Frontend URL
  FRONTEND_URL: z.string().optional(),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
