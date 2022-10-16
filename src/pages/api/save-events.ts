import type { NextApiRequest, NextApiResponse } from "next";

import { usePusherWebhook } from "../../hooks/use-pusher-webhook";
import { ClientRoomEvents } from "../../services/room-events";
import { VaultEvent } from "../../services/event-vault/types";
import { eventVault } from "../../services/event-vault";

const eventTypeParsers = {
  member_added: VaultEvent.room_people_enter,
  member_removed: VaultEvent.room_people_leave,
  [ClientRoomEvents.PEOPLE_FIRE_CONFETTI]: VaultEvent.people_fire_confetti,
  [ClientRoomEvents.PEOPLE_SELECT_POINT]: VaultEvent.people_select_point,
  [ClientRoomEvents.ROOM_SHOW_POINTS]: VaultEvent.room_show_points,
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

    const parsedEventType: VaultEvent =
      eventTypeParsers?.[event?.event || event?.name];

    const parsedEventData = JSON.parse(event.data || "{}");

    switch (parsedEventType) {
      case VaultEvent.room_show_points:
        await eventVault[parsedEventType]({
          event_sended_at: new Date(parsedEventData.room_countdown_started_at),
          people_id: parsedEventData.people_id,
          room_id: parsedRoomID,
          show_points: parsedEventData.show_points,
        });
        break;

      case VaultEvent.people_select_point:
        await eventVault[parsedEventType]({
          event_sended_at: eventsSendedAt,
          people_id: parsedEventData.people_id,
          room_id: parsedRoomID,
          people_selected_points: parsedEventData.people_selected_points,
        });
        break;

      default:
        await eventVault[parsedEventType]({
          event_sended_at: eventsSendedAt,
          people_id: parsedEventData.people_id,
          room_id: parsedRoomID,
        });
        break;
    }
  }

  return res.end();
};
