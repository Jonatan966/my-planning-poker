import { Room } from "@prisma/client";
import createStore, { StateCreator } from "zustand";
import { persistentLocalVars } from "../../configs/persistent-local-vars";
import { localStorageManager } from "../../utils/local-storage-manager";
import { Visits, VisitsStoreProps } from "./types";

const visitsStore: StateCreator<VisitsStoreProps, [], [], VisitsStoreProps> = (
  set,
  get
) => {
  function _persistVisits(visits: Visits) {
    set({ visits });
    localStorageManager.setItem(persistentLocalVars.ROOMS, visits);
  }

  function addVisit(room: Room) {
    const { visits } = get();

    if (!visits[room.id]) {
      visits[room.id] = room;
    }

    _persistVisits(visits);
  }

  function removeVisit(roomId: string) {
    const { visits } = get();

    if (visits[roomId]) {
      delete visits[roomId];
    }

    _persistVisits(visits);
  }

  return {
    visits:
      localStorageManager.getItem<Visits>(persistentLocalVars.ROOMS) || {},
    addVisit,
    removeVisit,
  };
};

export const useVisitsStore = createStore<VisitsStoreProps>(visitsStore);
export * from "./types";
