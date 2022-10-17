import PusherServer from "pusher";
import PusherWeb from "pusher-js";

export function connectOnPusherWeb() {
  const pusher = new PusherWeb(process.env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    channelAuthorization: {
      endpoint: "/api/auth/channel",
      transport: "ajax",
    },
    userAuthentication: {
      endpoint: "/api/auth/user",
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
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    useTLS: true,
  });

  return pusher;
}

export async function createWebConnection() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return new Promise<PusherWeb>((resolve) => {
    const pusher = connectOnPusherWeb();

    pusher.connection.bind("connected", () => {
      resolve(pusher);
    });
  });
}
