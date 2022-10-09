import type { NextApiRequest, NextApiResponse } from "next";
import type { Event as AmplitudeEvent } from "@amplitude/node";

import { amplitude } from "../../lib/amplitude";
import { connectOnPusherServer } from "../../lib/pusher";

interface PusherEvent {
  event: string;
  user_id: string;
  data: string;
  channel: string;
  name: string;
  socket_id: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const pusher = connectOnPusherServer();

  const webhook = pusher.webhook({
    headers: req.headers,
    rawBody: JSON.stringify(req.body),
  });

  const webhookIsValid = webhook.isValid({
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
  });

  if (!webhookIsValid) {
    return res.status(404).end();
  }

  const eventsSendedAt = webhook.getTime();
  const events = webhook.getEvents() as PusherEvent[];

  for (const event of events) {
    const parsedRoomID = event.channel.replace("presence-", "");

    const parsedEvent: AmplitudeEvent = {
      event_type: event.event,
      user_id: event.user_id,
      platform: "my-planning-poker",
      event_properties: {
        room_id: parsedRoomID,
        sended_at: eventsSendedAt,
        environment: process.env.NODE_ENV,
        sended_data: JSON.parse(event.data),
      },
    };

    const eventResponse = await amplitude.logEvent(parsedEvent);

    if (eventResponse.statusCode !== 200) {
      throw new Error(`Event "${event.event}" not sent`);
    }
  }

  return res.end();
};
