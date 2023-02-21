import preparePWA from "next-pwa";
import { withSentryConfig } from "@sentry/nextjs";

const inDevelopment = process.env.NODE_ENV === "development";

const withPWA = preparePWA({
  dest: "public",
  disable: inDevelopment,
});

const sentryOptions = {
  sentry: {
    autoInstrumentServerFunctions: true,
  },
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
};

const pwaConfig = withPWA(sentryOptions);

const sentryWebpackPluginOptions = {};

export default withSentryConfig(pwaConfig, sentryWebpackPluginOptions);
