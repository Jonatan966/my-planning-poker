import Pusher from "pusher";
import { PresenceChannel } from "pusher-js";
import {
  ClientRoomEvents,
  OnPeopleFireConfettiProps,
  OnPeopleSelectPointProps,
  OnRoomShowPointsProps,
  OnRoomSyncPeopleProps,
} from "./types";

function onPeopleSelectPoint(
  subscription: PresenceChannel,
  { people_selected_points, people_id }: OnPeopleSelectPointProps
) {
  subscription.trigger(ClientRoomEvents.PEOPLE_SELECT_POINT, {
    people_selected_points,
    people_id,
  });
}

function onRoomShowPoints(
  subscription: PresenceChannel,
  { room_countdown_started_at, show_points }: OnRoomShowPointsProps
) {
  subscription.trigger(ClientRoomEvents.ROOM_SHOW_POINTS, {
    room_countdown_started_at,
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

async function onRoomSyncPeople(
  pusherClient: Pusher,
  {
    people_id,
    selected_points,
    target_people_id,
    room_countdown_started_at,
  }: OnRoomSyncPeopleProps
) {
  await pusherClient.sendToUser(
    target_people_id,
    ClientRoomEvents.ROOM_SYNC_PEOPLE,
    {
      people_id,
      selected_points,
      room_countdown_started_at,
    }
  );
}

export const roomEvents = {
  onPeopleFireConfetti,
  onPeopleSelectPoint,
  onRoomShowPoints,
  onRoomSyncPeople,
};
export * from "./types";
