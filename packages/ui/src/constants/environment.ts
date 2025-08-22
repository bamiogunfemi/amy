export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  APP_NAME: import.meta.env.VITE_APP_NAME || "Amy Recruitment Platform",
  NODE_ENV: import.meta.env.MODE || "development",
  IS_PRODUCTION: import.meta.env.PROD || false,
  IS_DEVELOPMENT: import.meta.env.DEV || true,
} as const;

export const getApiUrl = () => ENV.API_URL;
export const getAppName = () => ENV.APP_NAME;
export const isProduction = () => ENV.IS_PRODUCTION;
export const isDevelopment = () => ENV.IS_DEVELOPMENT;
