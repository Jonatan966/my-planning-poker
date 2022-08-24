import PusherServer from "pusher";
import PusherWeb from "pusher-js";

export function connectOnPusherWeb() {
  const pusher = new PusherWeb(process.env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: "us2",
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
