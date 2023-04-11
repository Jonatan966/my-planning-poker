import sortBy from "lodash/sortBy";
import produce from "immer";
import { Members } from "pusher-js";

import { api } from "../../lib/axios";
import {
  MountRoomEventsProps,
  OnHighlightPeopleProps,
  OnLoadPeopleProps,
  People,
  RoomStoreProps,
} from "./types";
import * as RoomEvents from "../../services/room-events";

function sortPeoplesByArrival(peoples: People[]) {
  return sortBy(peoples, ["entered_at"], ["asc"]);
}

export function mountRoomHandler(
  set: MountRoomEventsProps[0],
  get: MountRoomEventsProps[1]
) {
  async function onLoadPeople(people: OnLoadPeopleProps) {
    const state = get();

    const updatedPeoplesList = state.peoples.concat({
      id: people.id,
      name: people.info.name,
      entered_at: people.info.entered_at,
    });
    const sortedPeoplesList = sortPeoplesByArrival(updatedPeoplesList);

    set({ peoples: sortedPeoplesList });

    const me = state.peoples.find(
      (people) => people.id === state.basicInfo.subscription.members.myID
    );

    if (me.points !== undefined || state.basicInfo.showPoints) {
      await api.post("/peoples/sync", {
        senderPeople: {
          id: me.id,
          points: me.points,
        },
        targetPeopleID: people.id,
        showPoints: state.basicInfo.showPoints,
      });
    }
  }

  function onPrepareRoom(roomPeoples: Members) {
    const parsedMembers = Object.entries<People>(
      roomPeoples.members
    ).map<People>(([id, people]) => ({
      id,
      name: people.name,
      entered_at: people.entered_at,
    }));

    const sortedMembers = sortPeoplesByArrival(parsedMembers);

    set({
      peoples: sortedMembers,
    });
  }

  function onPeopleLeave(people: People) {
    set((state) => ({
      peoples: state.peoples.filter(
        (statePeople) => statePeople.id !== people.id
      ),
    }));
  }

  function onSelectPoint({
    people_id,
    people_selected_points,
  }: RoomEvents.OnPeopleSelectPointProps) {
    set((state) => ({
      peoples: state.peoples.map((statePeople) =>
        statePeople.id === people_id
          ? {
              ...statePeople,
              points: people_selected_points,
            }
          : statePeople
      ),
    }));
  }

  function onShowPoints({ show_points }: RoomEvents.OnRoomShowPointsProps) {
    if (show_points) {
      const ONE_SECOND = 1000;
      const INIT_COUNTDOWN = 4;

      set(
        produce((state: RoomStoreProps) => {
          state.showAFKButton = false;
          state.basicInfo.showPointsCountdown = INIT_COUNTDOWN;
        })
      );

      function countdownStep() {
        set(
          produce((state: RoomStoreProps) => {
            if (state.basicInfo.showPointsCountdown === 0) {
              return;
            }

            state.basicInfo.showPointsCountdown--;
            setTimeout(countdownStep, ONE_SECOND);
          })
        );
      }

      countdownStep();
    }

    set(
      produce((state: RoomStoreProps) => {
        state.basicInfo.showPoints = show_points;

        if (!show_points) {
          state.peoples = state.peoples.map((people) => ({
            ...people,
            points: undefined,
          }));
        }
      })
    );
  }

  function onSyncPeople({
    people_id,
    selected_points,
    show_points,
  }: RoomEvents.OnRoomSyncPeopleProps) {
    const state = get();

    const updatedPeoplesList = state.peoples.map((people) =>
      people.id === people_id
        ? {
            ...people,
            points: selected_points,
          }
        : people
    );

    set(
      produce((state: RoomStoreProps) => {
        state.basicInfo.showPoints = !state.basicInfo.showPoints && show_points;
        state.peoples = updatedPeoplesList;
      })
    );
  }

  function onHighlightPeople({
    sender_id: targetPeopleID,
    highlight = true,
  }: OnHighlightPeopleProps) {
    set((state) => ({
      peoples: state.peoples.map((people) =>
        people.id === targetPeopleID
          ? {
              ...people,
              highlight,
            }
          : people
      ),
    }));
  }

  return {
    onLoadPeople,
    onPrepareRoom,
    onPeopleLeave,
    onSelectPoint,
    onShowPoints,
    onSyncPeople,
    onHighlightPeople,
  };
}
