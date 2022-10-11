import { PresenceChannel } from "pusher-js";
import {
  ClientRoomEvents,
  OnPeopleFireConfettiProps,
  OnPeopleSelectPointProps,
  OnRoomShowPointsProps,
} from "./types";

function onPeopleSelectPoint(
  subscription: PresenceChannel,
  { people_has_selected_points, people_id }: OnPeopleSelectPointProps
) {
  subscription.trigger(ClientRoomEvents.PEOPLE_SELECT_POINT, {
    people_has_selected_points,
    people_id,
  });
}

function onRoomShowPoints(
  subscription: PresenceChannel,
  { countdown_started_at, show_points }: OnRoomShowPointsProps
) {
  subscription.trigger(ClientRoomEvents.ROOM_SHOW_POINTS, {
    countdown_started_at,
    show_points,
  });
}

function onPeopleFireConfetti(
  subscription: PresenceChannel,
  { people_id }: OnPeopleFireConfettiProps
) {
  subscription.trigger(ClientRoomEvents.PEOPLE_FIRE_CONFETTI, {
    people_id,
  });
}

export const roomEvents = {
  onPeopleFireConfetti,
  onPeopleSelectPoint,
  onRoomShowPoints,
};
export { InternalRoomEvents, ClientRoomEvents } from "./types";
