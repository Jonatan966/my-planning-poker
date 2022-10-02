import _ from "lodash";
import produce from "immer";
import { Members } from "pusher-js";

import { api } from "../../lib/axios";
import {
  MountRoomEventsProps,
  OnHighlightPeopleProps,
  OnLoadPeopleProps,
  OnShowPointsProps,
  OnSyncPeoplePointsProps,
  People,
  RoomStoreProps,
} from "./types";

function sortPeoplesByArrival(peoples: People[]) {
  return _.sortBy(peoples, ["entered_at"], ["asc"]);
}

export function mountRoomEvents(
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

    if (me.points !== undefined) {
      await api.post("sync-people-points", {
        senderPeople: {
          id: me.id,
          points: me.points,
        },
        targetPeopleID: people.id,
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

  function onSelectPoint(people: Pick<People, "id" | "points">) {
    set((state) => ({
      peoples: state.peoples.map((statePeople) =>
        statePeople.id === people.id
          ? {
              ...statePeople,
              points: people.points,
            }
          : statePeople
      ),
    }));
  }

  function onShowPoints({ show }: OnShowPointsProps) {
    if (show) {
      set(
        produce((state: RoomStoreProps) => {
          state.basicInfo.showPointsCountdown = 3;
        })
      );

      const intervalID = setInterval(() => {
        set(
          produce((state: RoomStoreProps) => {
            if (state.basicInfo.showPointsCountdown === 0) {
              clearInterval(intervalID);
              return;
            }

            state.basicInfo.showPointsCountdown--;
          })
        );
      }, 1000);
    }

    set(
      produce((state: RoomStoreProps) => {
        state.basicInfo.showPoints = show;

        if (!show) {
          state.peoples = state.peoples.map((people) => ({
            ...people,
            points: undefined,
          }));
        }
      })
    );
  }

  function onSyncPeoplePoints(senderPeople: OnSyncPeoplePointsProps) {
    set((state) => ({
      peoples: state.peoples.map((people) =>
        people.id === senderPeople.id
          ? {
              ...people,
              points: senderPeople.points,
            }
          : people
      ),
    }));
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
    onSyncPeoplePoints,
    onHighlightPeople,
  };
}
