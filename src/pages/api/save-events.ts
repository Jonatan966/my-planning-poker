import type { NextApiRequest, NextApiResponse } from "next";
import type { Event as AmplitudeEvent } from "@amplitude/node";

import { amplitude } from "../../lib/amplitude";
import { usePusherWebhook } from "../../hooks/use-pusher-webhook";
import { InternalRoomEvents } from "../../stores/room-store";

const eventTypeParsers = {
  member_added: InternalRoomEvents.PEOPLE_ENTER,
  member_removed: InternalRoomEvents.PEOPLE_LEAVE,
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { events, eventsSendedAt, webhookIsValid } = usePusherWebhook({
    body: req.body,
    headers: req.headers,
  });

  if (!webhookIsValid) {
    return res.status(404).end();
  }

  for (const event of events) {
    const parsedRoomID = event.channel.replace("presence-", "");

    const parsedEventType: string =
      event?.event || eventTypeParsers?.[event?.name];

    const parsedEvent: AmplitudeEvent = {
      event_type: parsedEventType,
      user_id: event.user_id,
      platform: "my-planning-poker",
      event_properties: {
        room_id: parsedRoomID,
        sended_at: eventsSendedAt,
        environment: process.env.VERCEL_ENV,
      },
      user_properties: event?.data ? JSON.parse(event.data) : undefined,
    };

    const eventResponse = await amplitude.logEvent(parsedEvent);

    if (eventResponse.statusCode !== 200) {
      throw new Error(`Event "${event.event}" not sent`);
    }
  }

  return res.end();
};
