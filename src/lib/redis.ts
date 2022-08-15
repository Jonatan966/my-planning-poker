import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (error) =>
  console.log("[redis] error on try connect", error)
);

export async function connectOnRedis() {
  if (!client.isOpen) {
    await client.connect();
  }

  return client;
}
