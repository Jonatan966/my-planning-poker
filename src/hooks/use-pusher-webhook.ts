import Pusher from "pusher";
import type { IncomingHttpHeaders } from "http";
import { connectOnPusherServer } from "../lib/pusher";

interface UsePusherWebhookProps {
  headers: IncomingHttpHeaders;
  body: string;
  pusher?: Pusher;
}

interface PusherEvent {
  event: string;
  user_id: string;
  data: string;
  channel: string;
  name: string;
  socket_id: string;
}

export function usePusherWebhook({
  body,
  headers,
  pusher,
}: UsePusherWebhookProps) {
  const pusherClient = pusher || connectOnPusherServer();

  const webhook = pusherClient.webhook({
    headers,
    rawBody: JSON.stringify(body),
  });

  const webhookIsValid = webhook.isValid({
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
  });

  const eventsSendedAt = webhook.getTime();
  const events = webhook.getEvents() as PusherEvent[];

  return { events, eventsSendedAt, webhookIsValid };
}
