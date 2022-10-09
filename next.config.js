import preparePWA from "next-pwa";
import { withSentryConfig } from "@sentry/nextjs";

const inDevelopment = process.env.NODE_ENV === "development";

const withPWA = preparePWA({
  dest: "public",
  disable: inDevelopment,
});

const sentryOptions = {};

const sentryWebpackPluginOptions = {};

const sentryConfig = withSentryConfig(
  sentryOptions,
  sentryWebpackPluginOptions
);

export default withPWA(sentryConfig);
