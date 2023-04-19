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

function sortPeoplesByArrival(peoples: Record<string, People>) {
  return Object.fromEntries(
    sortBy(Object.entries(peoples), ([_, people]) => people.entered_at, ["asc"])
  );
}

function parseMembers(members: Record<string, People>) {
  const parsedMembers = {};

  for (const memberId in members) {
    const targetMember = members[memberId];

    parsedMembers[memberId] = {
      id: memberId,
      name: targetMember.name,
      entered_at: targetMember.entered_at,
    };
  }

  return parsedMembers;
}

export function mountRoomHandler(
  set: MountRoomEventsProps[0],
  get: MountRoomEventsProps[1]
) {
  async function onLoadPeople(people: OnLoadPeopleProps) {
    const state = get();

    const updatedPeoplesList = {
      ...state.peoples,
      [people.id]: {
        id: people.id,
        name: people.info.name,
        entered_at: people.info.entered_at,
      },
    };

    const sortedPeoplesList = sortPeoplesByArrival(updatedPeoplesList);

    set({ peoples: sortedPeoplesList });

    const me = state.peoples[state.basicInfo.subscription.members.myID];

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
    const parsedMembers = parseMembers(roomPeoples.members);

    const sortedMembers = sortPeoplesByArrival(parsedMembers);

    set({
      peoples: sortedMembers,
    });
  }

  function onPeopleLeave(people: People) {
    set(
      produce((state: RoomStoreProps) => {
        delete state.peoples[people.id];
        state.hasPeopleWithPoints = Object.values(state.peoples).some(
          (people) => typeof people.points !== "undefined"
        );
      })
    );
  }

  function onSelectPoint({
    people_id,
    people_selected_points,
  }: RoomEvents.OnPeopleSelectPointProps) {
    set(
      produce((state: RoomStoreProps) => {
        state.peoples[people_id].points = people_selected_points;
        state.hasPeopleWithPoints = true;
      })
    );
  }

  function onShowPoints({ show_points }: RoomEvents.OnRoomShowPointsProps) {
    if (show_points) {
      const ONE_SECOND = 1000;
      const INIT_COUNTDOWN = 4;

      set(
        produce((state: RoomStoreProps) => {
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

        if (show_points) {
          return state;
        }

        for (const peopleId in state.peoples) {
          state.peoples[peopleId].points = undefined;
        }

        state.hasPeopleWithPoints = false;

        return state;
      })
    );
  }

  function onSyncPeople({
    people_id,
    selected_points,
    show_points,
  }: RoomEvents.OnRoomSyncPeopleProps) {
    set(
      produce((state: RoomStoreProps) => {
        state.basicInfo.showPoints = !state.basicInfo.showPoints && show_points;
        state.peoples[people_id].points = selected_points;

        if (!state.hasPeopleWithPoints) {
          state.hasPeopleWithPoints = typeof selected_points !== "undefined";
        }
      })
    );
  }

  function onHighlightPeople({
    sender_id: targetPeopleID,
    highlight = true,
  }: OnHighlightPeopleProps) {
    set(
      produce((state: RoomStoreProps) => {
        state.peoples[targetPeopleID].highlight = highlight;
      })
    );
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
