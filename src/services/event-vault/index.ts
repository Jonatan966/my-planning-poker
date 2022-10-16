import { amplitude } from "../../lib/amplitude";
import { VaultEventHandlers, VaultEvent } from "./types";
import { prepareBasicEvent } from "./utils";

async function onRoomPeopleEnter(
  props: VaultEventHandlers.OnRoomPeopleEnterProps
) {
  const event = prepareBasicEvent(VaultEvent.room_people_enter, props);

  await amplitude.logEvent(event);
}

async function onRoomPeopleLeave(
  props: VaultEventHandlers.OnRoomPeopleLeaveProps
) {
  const event = prepareBasicEvent(VaultEvent.room_people_leave, props);

  await amplitude.logEvent(event);
}

async function onRoomShowPoints(
  props: VaultEventHandlers.OnRoomShowPointsProps
) {
  const event = prepareBasicEvent(VaultEvent.room_show_points, props, {
    event_properties: {
      show_points: props.show_points,
    },
    time: props.countdown_started_at,
  });

  await amplitude.logEvent(event);
}

async function onPeopleSelectPoint(
  props: VaultEventHandlers.OnPeopleSelectPointProps
) {
  const event = prepareBasicEvent(VaultEvent.people_select_point, props, {
    event_properties: {
      people_selected_points: props.people_selected_points,
    },
  });

  await amplitude.logEvent(event);
}

async function onPeopleFireConfetti(
  props: VaultEventHandlers.OnPeopleFireConfettiProps
) {
  const event = prepareBasicEvent(VaultEvent.people_fire_confetti, props);

  await amplitude.logEvent(event);
}

export const eventVault = {
  [VaultEvent.room_people_enter]: onRoomPeopleEnter,
  [VaultEvent.room_people_leave]: onRoomPeopleLeave,
  [VaultEvent.room_show_points]: onRoomShowPoints,
  [VaultEvent.people_select_point]: onPeopleSelectPoint,
  [VaultEvent.people_fire_confetti]: onPeopleFireConfetti,
};
