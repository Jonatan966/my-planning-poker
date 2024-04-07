import createStore, { StateCreator } from "zustand";
import { persistentLocalVars } from "../../configs/persistent-local-vars";
import { localStorageManager } from "../../utils/local-storage-manager";
import { VisitsStoreProps } from "./types";

const visitsStore: StateCreator<VisitsStoreProps, [], [], VisitsStoreProps> = (
  set
) => {
  const lastVisitedRoomId = localStorageManager.getItem<string>(
    persistentLocalVars.LAST_VISITED_ROOM
  );

  function addVisit(room_id: string) {
    set({ lastVisitedRoomId: room_id });

    localStorageManager.setItem(persistentLocalVars.LAST_VISITED_ROOM, room_id);
  }

  return {
    lastVisitedRoomId: lastVisitedRoomId,
    addVisit,
  };
};

export const useVisitsStore = createStore<VisitsStoreProps>(visitsStore);
export * from "./types";
