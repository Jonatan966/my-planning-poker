import mergeObjects from "lodash/merge";
import type { Event as AmplitudeEvent } from "@amplitude/node";

import {
  BasicEventProps,
  FreeVaultEvent,
  WebhookVaultEvent,
  WebhookVaultEventHandlers,
} from "./types";

export function prepareBasicRoomEvent(
  eventType: WebhookVaultEvent,
  basicProps: WebhookVaultEventHandlers.BasicRoomEventProps,
  restEvent?: Partial<AmplitudeEvent>
): AmplitudeEvent {
  const basicEvent: AmplitudeEvent = {
    event_type: eventType,
    user_id: basicProps.people_id,
    event_properties: {
      room_id: basicProps.room_id,
      environment: basicProps.environment,
    },
    time: basicProps.event_sended_at.getTime(),
  };

  return mergeObjects(basicEvent, restEvent);
}

export function prepareBasicEvent(
  eventType: WebhookVaultEvent | FreeVaultEvent,
  basicProps: BasicEventProps,
  restEvent?: Partial<AmplitudeEvent>
): AmplitudeEvent {
  const basicEvent: AmplitudeEvent = {
    event_type: eventType,
    event_properties: {
      environment: basicProps.environment,
    },
  };

  return mergeObjects(basicEvent, restEvent);
}
