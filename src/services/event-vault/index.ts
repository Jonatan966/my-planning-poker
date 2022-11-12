import { amplitude } from "../../lib/amplitude";
import {
  FreeVaultEvent,
  WebhookVaultEventHandlers,
  WebhookVaultEvent,
  FreeVaultEventHandlers,
} from "./types";
import { prepareBasicEvent, prepareBasicRoomEvent } from "./utils";

async function onRoomPeopleEnter(
  props: WebhookVaultEventHandlers.OnRoomPeopleEnterProps
) {
  const event = prepareBasicRoomEvent(
    WebhookVaultEvent.room_people_enter,
    props
  );

  await amplitude.logEvent(event);
}

async function onRoomPeopleLeave(
  props: WebhookVaultEventHandlers.OnRoomPeopleLeaveProps
) {
  const event = prepareBasicRoomEvent(
    WebhookVaultEvent.room_people_leave,
    props
  );

  await amplitude.logEvent(event);
}

async function onRoomShowPoints(
  props: WebhookVaultEventHandlers.OnRoomShowPointsProps
) {
  const event = prepareBasicRoomEvent(
    WebhookVaultEvent.room_show_points,
    props,
    {
      event_properties: {
        show_points: props.show_points,
      },
    }
  );

  await amplitude.logEvent(event);
}

async function onPeopleSelectPoint(
  props: WebhookVaultEventHandlers.OnPeopleSelectPointProps
) {
  const event = prepareBasicRoomEvent(
    WebhookVaultEvent.people_select_point,
    props,
    {
      event_properties: {
        people_selected_points: props.people_selected_points,
      },
    }
  );

  await amplitude.logEvent(event);
}

async function onPeopleFireConfetti(
  props: WebhookVaultEventHandlers.OnPeopleFireConfettiProps
) {
  const event = prepareBasicRoomEvent(
    WebhookVaultEvent.people_fire_confetti,
    props
  );

  await amplitude.logEvent(event);
}

async function onPeopleSendFeedback(
  props: FreeVaultEventHandlers.OnPeopleSendFeedback
) {
  const event = prepareBasicEvent(FreeVaultEvent.people_send_feedback, {
    event_properties: {
      feedback_type: props.feedback_type,
    },
  });

  await amplitude.logEvent(event);
}

export const eventVault = {
  [WebhookVaultEvent.room_people_enter]: onRoomPeopleEnter,
  [WebhookVaultEvent.room_people_leave]: onRoomPeopleLeave,
  [WebhookVaultEvent.room_show_points]: onRoomShowPoints,
  [WebhookVaultEvent.people_select_point]: onPeopleSelectPoint,
  [WebhookVaultEvent.people_fire_confetti]: onPeopleFireConfetti,
  [FreeVaultEvent.people_send_feedback]: onPeopleSendFeedback,
};
