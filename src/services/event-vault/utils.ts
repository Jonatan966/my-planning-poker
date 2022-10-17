import _ from "lodash";
import type { Event as AmplitudeEvent } from "@amplitude/node";
import { VaultEvent, VaultEventHandlers } from "./types";

export function prepareBasicEvent(
  eventType: VaultEvent,
  basicProps: VaultEventHandlers.BasicEventProps,
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

  return _.merge(basicEvent, restEvent);
}
