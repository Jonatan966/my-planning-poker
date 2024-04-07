import { amplitude } from "../../lib/amplitude";
import {
  FreeVaultEvent,
  FreeVaultEventHandlers,
  WebhookVaultEvent,
  WebhookVaultEventHandlers,
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

async function onRoomShowAfkAlert(
  props: WebhookVaultEventHandlers.OnRoomShowAfkAlertProps
) {
  const event = prepareBasicRoomEvent(
    WebhookVaultEvent.room_show_afk_alert,
    props
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
    user_id: props.people_id,
  });

  await amplitude.logEvent(event);
}

async function onRoomCreate(props: FreeVaultEventHandlers.OnRoomCreate) {
  const event = prepareBasicEvent(FreeVaultEvent.room_create, {
    event_properties: {
      room_id: props.room_id,
    },
    user_id: props.people_id,
  });

  await amplitude.logEvent(event);
}

async function onPeopleInactivate(
  props: WebhookVaultEventHandlers.OnPeopleInactivateProps
) {
  const event = prepareBasicRoomEvent(
    WebhookVaultEvent.people_inactivate,
    props,
    {
      event_properties: {
        has_confirmed_activity: props.has_confirmed_activity,
      },
    }
  );

  await amplitude.logEvent(event);
}

export const eventVault = {
  [WebhookVaultEvent.room_people_enter]: onRoomPeopleEnter,
  [WebhookVaultEvent.room_people_leave]: onRoomPeopleLeave,
  [WebhookVaultEvent.room_show_points]: onRoomShowPoints,
  [WebhookVaultEvent.room_show_afk_alert]: onRoomShowAfkAlert,
  [WebhookVaultEvent.people_select_point]: onPeopleSelectPoint,
  [WebhookVaultEvent.people_fire_confetti]: onPeopleFireConfetti,
  [WebhookVaultEvent.people_inactivate]: onPeopleInactivate,
  [FreeVaultEvent.people_send_feedback]: onPeopleSendFeedback,
  [FreeVaultEvent.room_create]: onRoomCreate,
};
