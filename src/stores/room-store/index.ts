import pusherJs, { Members, PresenceChannel } from "pusher-js";
import createStore, { StateCreator } from "zustand";
import { produce } from "immer";
import { api } from "../../lib/axios";
import { createWebConnection } from "../../lib/pusher";
import {
  BasicRoomInfo,
  MainRoomEvents,
  People,
  RoomInfo,
  RoomStoreProps,
} from "./types";

let connection: pusherJs;

const roomStore: StateCreator<RoomStoreProps, [], [], RoomStoreProps> = (
  set,
  get
) => {
  const roomEvents = {
    onLoadPeople(people: { id: string; info: { name: string } }) {
      set((state) => ({
        peoples: state.peoples.concat({
          id: people.id,
          name: people.info.name,
        }),
      }));
    },

    onPrepareRoom(roomPeoples: Members) {
      const parsedMembers = Object.entries<People>(
        roomPeoples.members
      ).map<People>(([id, people]) => ({
        id,
        name: people.name,
      }));

      set({
        peoples: parsedMembers,
      });
    },

    onPeopleLeave(people: People) {
      set((state) => ({
        peoples: state.peoples.filter(
          (statePeople) => statePeople.id !== people.id
        ),
      }));
    },

    onSelectPoint(people: Pick<People, "id" | "points">) {
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
    },

    onShowPoints({ show }: { show: boolean }) {
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
    },
  };

  const INITIAL_STORE_VALUE: RoomStoreProps = {
    basicInfo: {
      id: undefined,
      name: undefined,
      showPoints: false,
      showPointsCountdown: 0,
      subscription: undefined,
    },
    peoples: [],
    connectOnRoom,
    createRoom,
    disconnectOnRoom,
    selectPoint,
    setRoomPointsVisibility,
  };

  function _reset() {
    set(INITIAL_STORE_VALUE, true);
  }

  function _createRoom(roomInfo: RoomInfo) {
    set({
      basicInfo: {
        showPoints: false,
        id: roomInfo.id,
        name: roomInfo.name,
        subscription: roomInfo.subscription,
        showPointsCountdown: 0,
      },
    });
  }

  function prepareRoomConnection(subscription: PresenceChannel) {
    subscription.bind_global((event) => console.log("[pusher events]", event));
    subscription.bind(MainRoomEvents.LOAD_PEOPLE, roomEvents.onLoadPeople);
    subscription.bind(MainRoomEvents.PREPARE_ROOM, roomEvents.onPrepareRoom);
    subscription.bind(MainRoomEvents.PEOPLE_LEAVE, roomEvents.onPeopleLeave);
    subscription.bind(MainRoomEvents.SELECT_POINT, roomEvents.onSelectPoint);
    subscription.bind(MainRoomEvents.SHOW_POINTS, roomEvents.onShowPoints);

    return () => {
      subscription.unbind_all();
      subscription.unbind_global();
    };
  }

  function disconnectOnRoom() {
    if (!connection) {
      return;
    }

    const subscriptions = connection.allChannels() as PresenceChannel[];

    _reset();

    for (const subscription of subscriptions) {
      subscription.unbind_all();
      subscription.unbind_global();
      subscription.unsubscribe();
      subscription.disconnect();
    }

    connection.unbind_all();
    connection.unbind_global();
    connection.disconnect();
  }

  async function createRoom(roomName: string) {
    const { data: roomInfo } = await api.post<RoomInfo>("/create-room", {
      name: roomName,
    });

    return roomInfo;
  }

  async function connectOnRoom(roomBasicInfo: BasicRoomInfo) {
    connection = await createWebConnection();

    const subscription = connection.subscribe(
      `presence-${roomBasicInfo.id}`
    ) as PresenceChannel;

    const preparedRoom = prepareRoomConnection(subscription);

    const roomInfo: RoomInfo = {
      ...roomBasicInfo,
      subscription,
    };

    _createRoom(roomInfo);

    return preparedRoom;
  }

  async function selectPoint(points: number) {
    const { basicInfo } = get();

    const myID = basicInfo.subscription.members.myID;

    roomEvents.onSelectPoint({
      id: myID,
      points,
    });

    basicInfo.subscription.trigger(MainRoomEvents.SELECT_POINT, {
      id: myID,
      points,
    });
  }

  async function setRoomPointsVisibility(show?: boolean) {
    const { basicInfo } = get();

    basicInfo.subscription.trigger(MainRoomEvents.SHOW_POINTS, {
      show,
    });

    roomEvents.onShowPoints({ show });
  }

  return INITIAL_STORE_VALUE;
};

export const useRoomStore = createStore<RoomStoreProps>(roomStore);
export * from "./types";
