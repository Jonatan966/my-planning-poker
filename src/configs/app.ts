export const appConfig = {
  isDevelopment: process.env.VERCEL_ENV === "development",
  environment: process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV,
};
