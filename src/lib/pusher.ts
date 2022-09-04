import PusherServer from "pusher";
import pusherJs from "pusher-js";
import PusherWeb from "pusher-js";

export function connectOnPusherWeb() {
  const pusher = new PusherWeb(process.env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: "us2",
    channelAuthorization: {
      endpoint: "/api/auth/channel",
      transport: "ajax",
    },
  });

  return pusher;
}

export function connectOnPusherServer() {
  const pusher = new PusherServer({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: "us2",
    useTLS: true,
  });

  return pusher;
}

export async function createWebConnection() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return new Promise<pusherJs>((resolve) => {
    const pusher = connectOnPusherWeb();

    pusher.connection.bind("connected", () => {
      resolve(pusher);
    });
  });
}
