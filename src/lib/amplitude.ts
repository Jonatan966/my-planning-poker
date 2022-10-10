import { init, OfflineRetryHandler } from "@amplitude/node";

export const amplitude = init(process.env.AMPLITUDE_KEY, {
  retryClass: new OfflineRetryHandler(process.env.AMPLITUDE_KEY),
});
