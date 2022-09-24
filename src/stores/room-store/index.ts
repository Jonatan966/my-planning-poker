import pusherJs, { Members, PresenceChannel } from "pusher-js";
import createStore, { StateCreator } from "zustand";
import { produce } from "immer";
import { api } from "../../lib/axios";
import { createWebConnection } from "../../lib/pusher";
import {
  BasicRoomInfo,
  EventMode,
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
    async onLoadPeople(people: { id: string; info: { name: string } }) {
      const state = get();

      set((state) => ({
        peoples: state.peoples.concat({
          id: people.id,
          name: people.info.name,
        }),
      }));

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

    onSyncPeoplePoints(senderPeople: { id: string; points: number }) {
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
    },

    onHighlightPeople({
      sender_id: targetPeopleID,
      highlight = true,
    }: {
      sender_id: string;
      highlight?: boolean;
    }) {
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
    showEasterEgg: false,
    setEasterEggVisibility,
    connectOnRoom,
    createRoom,
    disconnectOnRoom,
    selectPoint,
    setRoomPointsVisibility,
    broadcastConfetti,
    setPeopleHighlight,
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
    subscription.bind(
      MainRoomEvents.FIRE_CONFETTI,
      roomEvents.onHighlightPeople
    );

    connection.user.bind(
      MainRoomEvents.SYNC_PEOPLE_POINTS,
      roomEvents.onSyncPeoplePoints
    );

    return disconnectOnRoom;
  }

  function disconnectOnRoom() {
    if (!connection) {
      return;
    }

    const subscriptions = connection.allChannels() as PresenceChannel[];

    for (const subscription of subscriptions) {
      subscription.unbind_all();
      subscription.unbind_global();
    }

    connection.user.unbind_all();
    connection.unbind_all();
    connection.unbind_global();
    connection.disconnect();

    _reset();
  }

  async function createRoom(roomName: string) {
    const { data: roomInfo } = await api.post<RoomInfo>("/create-room", {
      name: roomName,
    });

    return roomInfo;
  }

  async function connectOnRoom(roomBasicInfo: BasicRoomInfo) {
    connection = await createWebConnection();
    set({ connection });

    connection.user.signin();

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

  async function setRoomPointsVisibility(
    show?: boolean,
    mode: EventMode = EventMode.PUBLIC
  ) {
    const { basicInfo } = get();

    if (mode === EventMode.PUBLIC) {
      basicInfo.subscription.trigger(MainRoomEvents.SHOW_POINTS, {
        show,
      });
    }

    roomEvents.onShowPoints({ show });
  }

  function setEasterEggVisibility(show: boolean) {
    set({ showEasterEgg: show });
  }

  function broadcastConfetti() {
    const { basicInfo } = get();

    basicInfo.subscription.trigger(MainRoomEvents.FIRE_CONFETTI, {
      sender_id: basicInfo.subscription.members.myID,
    });
  }

  function setPeopleHighlight(people_id: string, highlight?: boolean) {
    roomEvents.onHighlightPeople({
      sender_id: people_id,
      highlight,
    });
  }

  return INITIAL_STORE_VALUE;
};

export const useRoomStore = createStore<RoomStoreProps>(roomStore);
export * from "./types";
