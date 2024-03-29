export const appConfig = {
  isDevelopment: process.env.VERCEL_ENV === "development",
  environment: process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV,
  repositoryUrl: "https://github.com/Jonatan966/my-planning-poker",
  creatorUrl: "https://github.com/Jonatan966",
  inactivityDialog: {
    countdown: Number(process.env.NEXT_PUBLIC_INACTIVITY_COUNTDOWN),
    delay: Number(process.env.NEXT_PUBLIC_INACTIVITY_DELAY),
  },
};
