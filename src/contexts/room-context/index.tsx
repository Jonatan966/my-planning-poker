import pusherJs, { PresenceChannel } from "pusher-js";
import { createContext, useContext, useRef } from "react";

import { api } from "../../lib/axios";
import { createWebConnection } from "../../lib/pusher";
import { useRoomEventManager } from "./room-event-manager";
import {
  RoomContextProps,
  RoomContextProviderProps,
  RoomInfo,
  MainRoomEvents,
} from "./types";

const RoomContext = createContext({} as RoomContextProps);

export function RoomContextProvider({ children }: RoomContextProviderProps) {
  const {
    room,
    roomEvents,
    showPointsCountdown,
    prepareRoomConnection,
    updateRoom,
  } = useRoomEventManager();

  const me = room?.peoples.find(
    (people) => people.id === room?.subscription?.members.myID
  );

  const connection = useRef<pusherJs>();

  function disconnectOnRoom() {
    const subscriptions = connection.current.allChannels() as PresenceChannel[];

    updateRoom({
      type: "reset",
    });

    for (const subscription of subscriptions) {
      subscription.unbind_all();
      subscription.unsubscribe();
      subscription.disconnect();
    }

    connection.current.unbind_all();
  }

  async function createRoom(roomName: string) {
    const { data: roomInfo } = await api.post<RoomInfo>("/create-room", {
      name: roomName,
    });

    return roomInfo;
  }

  async function connectOnRoom(roomId: string) {
    if (connection.current) {
      disconnectOnRoom();
    } else {
      connection.current = await createWebConnection();
    }

    const subscription = connection.current.subscribe(
      `presence-${roomId}`
    ) as PresenceChannel;

    const preparedRoom = prepareRoomConnection(subscription);

    const { data } = await api.get("/get-room-name", {
      params: {
        room_id: roomId,
      },
    });

    const roomInfo: RoomInfo = {
      id: roomId,
      name: data.name,
      subscription,
    };

    updateRoom({
      type: "create",
      payload: roomInfo,
    });

    return preparedRoom;
  }

  async function selectPoint(points: number) {
    roomEvents.onSelectPoint({
      id: me.id,
      points,
    });

    room.subscription.trigger(MainRoomEvents.SELECT_POINT, {
      id: me.id,
      points,
    });
  }

  async function setRoomPointsVisibility(show?: boolean) {
    room.subscription.trigger(MainRoomEvents.SHOW_POINTS, {
      show,
    });

    roomEvents.onShowPoints({ show });
  }

  return (
    <RoomContext.Provider
      value={{
        connectOnRoom,
        createRoom,
        disconnectOnRoom,
        selectPoint,
        setRoomPointsVisibility,
        room,
        me,
        showPointsCountdown,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  return useContext(RoomContext);
}
