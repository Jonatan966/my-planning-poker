import pusherJs, { PresenceChannel } from "pusher-js";
import createStore, { StateCreator } from "zustand";

import { mountRoomHandler } from "./mount-room-handler";
import { api } from "../../lib/axios";
import { createWebConnection } from "../../lib/pusher";

import {
  InternalRoomEvents,
  ClientRoomEvents,
  roomEvents,
} from "../../services/room-events";
import { getDateWithTimezone } from "../../utils/get-date-with-timezone";
import { BasicRoomInfo, EventMode, RoomInfo, RoomStoreProps } from "./types";

let connection: pusherJs;

const roomStore: StateCreator<RoomStoreProps, [], [], RoomStoreProps> = (
  set,
  get
) => {
  const roomHandler = mountRoomHandler(set, get);

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

  function _logEvent(event: string) {
    console.log("[pusher events]", event);
  }

  function prepareRoomConnection(subscription: PresenceChannel) {
    subscription.bind_global(_logEvent);

    subscription.bind(
      InternalRoomEvents.PEOPLE_ENTER,
      roomHandler.onLoadPeople
    );
    subscription.bind(
      InternalRoomEvents.PREPARE_ROOM,
      roomHandler.onPrepareRoom
    );
    subscription.bind(
      InternalRoomEvents.PEOPLE_LEAVE,
      roomHandler.onPeopleLeave
    );
    subscription.bind(
      ClientRoomEvents.PEOPLE_SELECT_POINT,
      roomHandler.onSelectPoint
    );
    subscription.bind(
      ClientRoomEvents.ROOM_SHOW_POINTS,
      roomHandler.onShowPoints
    );
    subscription.bind(
      ClientRoomEvents.PEOPLE_FIRE_CONFETTI,
      roomHandler.onHighlightPeople
    );

    connection.user.bind(
      ClientRoomEvents.ROOM_SYNC_PEOPLE,
      roomHandler.onSyncPeople
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
    const { data: roomInfo } = await api.post<RoomInfo>("/rooms", {
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

    roomHandler.onSelectPoint({
      people_id: myID,
      people_selected_points: points,
    });

    roomEvents.onPeopleSelectPoint(basicInfo.subscription, {
      people_id: myID,
      people_selected_points: points,
    });
  }

  async function setRoomPointsVisibility(
    show?: boolean,
    startedAt = getDateWithTimezone().getTime(),
    mode: EventMode = EventMode.PUBLIC
  ) {
    const { basicInfo } = get();

    if (mode === EventMode.PUBLIC) {
      roomEvents.onRoomShowPoints(basicInfo.subscription, {
        show_points: show,
        room_countdown_started_at: startedAt,
      });
    }

    roomHandler.onShowPoints({
      show_points: show,
      room_countdown_started_at: startedAt,
    });
  }

  function setEasterEggVisibility(show: boolean) {
    set({ showEasterEgg: show });
  }

  function broadcastConfetti() {
    const { basicInfo } = get();

    roomEvents.onPeopleFireConfetti(basicInfo.subscription, {
      people_id: basicInfo.subscription.members.myID,
    });
  }

  function setPeopleHighlight(people_id: string, highlight?: boolean) {
    roomHandler.onHighlightPeople({
      sender_id: people_id,
      highlight,
    });
  }

  return INITIAL_STORE_VALUE;
};

export const useRoomStore = createStore<RoomStoreProps>(roomStore);
export * from "./types";
