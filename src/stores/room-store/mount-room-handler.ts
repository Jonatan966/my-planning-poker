import _ from "lodash";
import produce from "immer";
import { Members } from "pusher-js";

import { api } from "../../lib/axios";
import {
  MountRoomEventsProps,
  OnHighlightPeopleProps,
  OnLoadPeopleProps,
  OnShowPointsProps,
  OnSyncPeopleProps,
  People,
  RoomStoreProps,
} from "./types";

function sortPeoplesByArrival(peoples: People[]) {
  return _.sortBy(peoples, ["entered_at"], ["asc"]);
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

    if (me.points !== undefined || !!state.basicInfo.countdownStartedAt) {
      await api.post("sync-people", {
        senderPeople: {
          id: me.id,
          points: me.points,
        },
        targetPeopleID: people.id,
        countdownStartedAt: state.basicInfo.countdownStartedAt,
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

  function onShowPoints({ show, startedAt }: OnShowPointsProps) {
    if (show) {
      const ONE_SECOND = 1000;
      const MAX_COUNTDOWN = 5;

      const currentTime = Date.now();
      const startDelay = (currentTime - startedAt) / 1000;
      const firstCountdown = MAX_COUNTDOWN - Math.floor(startDelay);

      const parsedFirstCountdown = firstCountdown >= 0 ? firstCountdown : 0;

      const firstTimeoutDelay =
        (Math.ceil(startDelay) - startDelay) * 1000 || ONE_SECOND;

      set(
        produce((state: RoomStoreProps) => {
          state.basicInfo.showPointsCountdown = parsedFirstCountdown;
          state.basicInfo.countdownStartedAt = startedAt;
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

      if (parsedFirstCountdown > 0) {
        setTimeout(countdownStep, firstTimeoutDelay);
      }
    }

    set(
      produce((state: RoomStoreProps) => {
        state.basicInfo.showPoints = show;

        if (!show) {
          state.basicInfo.countdownStartedAt = undefined;
          state.peoples = state.peoples.map((people) => ({
            ...people,
            points: undefined,
          }));
        }
      })
    );
  }

  function onSyncPeople(senderPeople: OnSyncPeopleProps) {
    const state = get();

    const updatedPeoplesList = state.peoples.map((people) =>
      people.id === senderPeople.id
        ? {
            ...people,
            points: senderPeople.points,
          }
        : people
    );

    if (
      !state.basicInfo.countdownStartedAt &&
      senderPeople.countdownStartedAt
    ) {
      onShowPoints({
        show: true,
        startedAt: senderPeople.countdownStartedAt,
      });
    }

    set({ peoples: updatedPeoplesList });
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
