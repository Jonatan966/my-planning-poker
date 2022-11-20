import mergeObjects from "lodash/merge";
import type { Event as AmplitudeEvent } from "@amplitude/node";

import {
  FreeVaultEvent,
  WebhookVaultEvent,
  WebhookVaultEventHandlers,
} from "./types";
import { appConfig } from "../../configs/app";

export function prepareBasicRoomEvent(
  eventType: WebhookVaultEvent,
  basicProps: WebhookVaultEventHandlers.BasicRoomEventProps,
  restEvent?: Partial<AmplitudeEvent>
): AmplitudeEvent {
  const basicEvent = prepareBasicEvent(eventType, {
    user_id: basicProps.people_id,
    event_properties: {
      room_id: basicProps.room_id,
    },
    time: basicProps.event_sended_at.getTime(),
  });

  return mergeObjects(basicEvent, restEvent);
}

export function prepareBasicEvent(
  eventType: WebhookVaultEvent | FreeVaultEvent,
  restEvent?: Partial<AmplitudeEvent>
): AmplitudeEvent {
  const basicEvent: AmplitudeEvent = {
    event_type: eventType,
    event_properties: {
      environment: appConfig.environment,
    },
  };

  return mergeObjects(basicEvent, restEvent);
}
