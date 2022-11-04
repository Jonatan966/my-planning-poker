import { amplitude } from "../../lib/amplitude";
import { VaultEventHandlers, VaultEvent } from "./types";
import { prepareBasicEvent, prepareBasicRoomEvent } from "./utils";

async function onRoomPeopleEnter(
  props: VaultEventHandlers.OnRoomPeopleEnterProps
) {
  const event = prepareBasicRoomEvent(VaultEvent.room_people_enter, props);

  await amplitude.logEvent(event);
}

async function onRoomPeopleLeave(
  props: VaultEventHandlers.OnRoomPeopleLeaveProps
) {
  const event = prepareBasicRoomEvent(VaultEvent.room_people_leave, props);

  await amplitude.logEvent(event);
}

async function onRoomShowPoints(
  props: VaultEventHandlers.OnRoomShowPointsProps
) {
  const event = prepareBasicRoomEvent(VaultEvent.room_show_points, props, {
    event_properties: {
      show_points: props.show_points,
    },
  });

  await amplitude.logEvent(event);
}

async function onPeopleSelectPoint(
  props: VaultEventHandlers.OnPeopleSelectPointProps
) {
  const event = prepareBasicRoomEvent(VaultEvent.people_select_point, props, {
    event_properties: {
      people_selected_points: props.people_selected_points,
    },
  });

  await amplitude.logEvent(event);
}

async function onPeopleFireConfetti(
  props: VaultEventHandlers.OnPeopleFireConfettiProps
) {
  const event = prepareBasicRoomEvent(VaultEvent.people_fire_confetti, props);

  await amplitude.logEvent(event);
}

async function onPeopleSendFeedback(
  props: VaultEventHandlers.OnPeopleSendFeedback
) {
  const event = prepareBasicEvent(VaultEvent.people_send_feedback, props);

  await amplitude.logEvent(event);
}

export const eventVault = {
  [VaultEvent.room_people_enter]: onRoomPeopleEnter,
  [VaultEvent.room_people_leave]: onRoomPeopleLeave,
  [VaultEvent.room_show_points]: onRoomShowPoints,
  [VaultEvent.people_select_point]: onPeopleSelectPoint,
  [VaultEvent.people_fire_confetti]: onPeopleFireConfetti,
  [VaultEvent.people_send_feedback]: onPeopleSendFeedback,
};
