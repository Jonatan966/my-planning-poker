import { Room } from "@prisma/client";
import createStore, { StateCreator } from "zustand";
import { persistentLocalVars } from "../../configs/persistent-local-vars";
import { localStorageManager } from "../../utils/local-storage-manager";
import { Visits, VisitsStoreProps } from "./types";

const visitsStore: StateCreator<VisitsStoreProps, [], [], VisitsStoreProps> = (
  set,
  get
) => {
  const visits =
    localStorageManager.getItem<Visits>(persistentLocalVars.ROOMS) || {};
  const lastVisitedRoomId = localStorageManager.getItem<string>(
    persistentLocalVars.LAST_VISITED_ROOM
  );

  function _persistVisits(visits: Visits, lastVisitedRoomId?: string) {
    const lastVisitedRoom = visits?.[lastVisitedRoomId];

    set({ visits, lastVisitedRoom });

    localStorageManager.setItem(persistentLocalVars.ROOMS, visits);
    localStorageManager.setItem(
      persistentLocalVars.LAST_VISITED_ROOM,
      lastVisitedRoomId
    );
  }

  function addVisit(room: Omit<Room, "environment">) {
    const { visits } = get();

    if (!visits[room.id]) {
      visits[room.id] = {
        ...room,
        environment: null,
      };
    }

    _persistVisits(visits, room.id);
  }

  function removeVisit(roomId: string) {
    const { visits, lastVisitedRoom } = get();

    if (visits[roomId]) {
      delete visits[roomId];
    }

    const persistLastVisit =
      roomId === lastVisitedRoom?.id ? null : lastVisitedRoom?.id;

    _persistVisits(visits, persistLastVisit);
  }

  return {
    visits,
    lastVisitedRoom: visits?.[lastVisitedRoomId],
    addVisit,
    removeVisit,
  };
};

export const useVisitsStore = createStore<VisitsStoreProps>(visitsStore);
export * from "./types";
