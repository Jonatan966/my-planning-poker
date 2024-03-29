import Pusher from "pusher";
import { PresenceChannel } from "pusher-js";
import {
  ClientRoomEvents,
  OnPeopleFireConfettiProps,
  OnPeopleInactivateProps,
  OnPeopleSelectPointProps,
  OnRoomShowAfkAlertProps,
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
  { show_points }: OnRoomShowPointsProps
) {
  subscription.trigger(ClientRoomEvents.ROOM_SHOW_POINTS, {
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
    show_points,
  }: OnRoomSyncPeopleProps
) {
  await pusherClient.sendToUser(
    target_people_id,
    ClientRoomEvents.ROOM_SYNC_PEOPLE,
    {
      people_id,
      selected_points,
      show_points,
    }
  );
}

function onRoomShowAfkAlert(
  subscription: PresenceChannel,
  { people_id }: OnRoomShowAfkAlertProps
) {
  subscription.trigger(ClientRoomEvents.ROOM_SHOW_AFK_ALERT, {
    people_id,
  });
}

function onPeopleInactivate(
  subscription: PresenceChannel,
  { people_id, has_confirmed_activity = false }: OnPeopleInactivateProps
) {
  subscription.trigger(ClientRoomEvents.PEOPLE_INACTIVATE, {
    people_id,
    has_confirmed_activity,
  });
}

export const roomEvents = {
  onPeopleFireConfetti,
  onPeopleSelectPoint,
  onRoomShowPoints,
  onRoomSyncPeople,
  onRoomShowAfkAlert,
  onPeopleInactivate,
};

export * from "./types";
