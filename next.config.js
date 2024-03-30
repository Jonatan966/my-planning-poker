import { withSentryConfig } from "@sentry/nextjs";
import preparePWA from "next-pwa";

const inDevelopment = process.env.NODE_ENV === "development";

const withPWA = preparePWA({
  dest: "public",
  disable: inDevelopment,
});

const sentryOptions = {
  sentry: {
    autoInstrumentServerFunctions: true,
    hideSourceMaps: true,
  },
};

const pwaConfig = withPWA(sentryOptions);

const sentryWebpackPluginOptions = {};

export default withSentryConfig(pwaConfig, sentryWebpackPluginOptions);
