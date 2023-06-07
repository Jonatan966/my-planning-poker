import type { NextApiRequest, NextApiResponse } from "next";

import { usePusherWebhook } from "../../hooks/use-pusher-webhook";
import { eventVault } from "../../services/event-vault";
import { WebhookVaultEvent } from "../../services/event-vault/types";
import { ClientRoomEvents } from "../../services/room-events";

const eventTypeParsers = {
  member_added: WebhookVaultEvent.room_people_enter,
  member_removed: WebhookVaultEvent.room_people_leave,
  [ClientRoomEvents.PEOPLE_FIRE_CONFETTI]:
    WebhookVaultEvent.people_fire_confetti,
  [ClientRoomEvents.PEOPLE_SELECT_POINT]: WebhookVaultEvent.people_select_point,
  [ClientRoomEvents.ROOM_SHOW_POINTS]: WebhookVaultEvent.room_show_points,
  [ClientRoomEvents.ROOM_SHOW_AFK_ALERT]: WebhookVaultEvent.room_show_afk_alert,
  [ClientRoomEvents.PEOPLE_INACTIVATE]: WebhookVaultEvent.people_inactivate,
};

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "POST") {
    return response.status(405).end();
  }

  const { events, eventsSendedAt, webhookIsValid } = usePusherWebhook({
    body: request.body,
    headers: request.headers,
  });

  if (!webhookIsValid) {
    return response.status(404).end();
  }

  for (const event of events) {
    const parsedRoomID = event.channel.replace("presence-", "");
    const eventName = event?.event || event?.name;

    const parsedEventType: WebhookVaultEvent = eventTypeParsers?.[eventName];

    const parsedEventData = JSON.parse(event.data || "{}");

    await eventVault[parsedEventType]({
      event_sended_at: eventsSendedAt,
      people_id: event.user_id,
      room_id: parsedRoomID,
      ...parsedEventData,
    });
  }

  return response.end();
};
