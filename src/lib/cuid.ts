import { init, isCuid } from "@paralleldrive/cuid2";

const createId = init({
  random: Math.random,
  length: 10,
  fingerprint: "my-planning-poker",
});

export { createId, isCuid };
