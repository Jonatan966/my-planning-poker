import preparePWA from "next-pwa";
import { withSentryConfig } from "@sentry/nextjs";

const inDevelopment = process.env.NODE_ENV === "development";

const withPWA = preparePWA({
  dest: "public",
  disable: inDevelopment,
});

const sentryConfig = withSentryConfig(
  {
    sentry: {
      hideSourceMaps: true,
      autoInstrumentServerFunctions: true,
    },
  },
  {
    silent: true,
  }
);

export default withPWA(sentryConfig);
