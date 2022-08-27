import { Channel } from "pusher-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { api } from "../lib/axios";
import { connectOnPusherWeb } from "../lib/pusher";
import { filterDistinctObjects } from "../utils/filter-distinct-objects";

interface RoomContextProviderProps {
  children: ReactNode;
}

export interface People {
  id?: number;
  name: string;
  points?: number;
}

interface RoomInfo {
  name: string;
  id: string;
  showPoints?: boolean;
  peoples?: People[];
}

interface RoomReducerAction {
  type:
    | "create"
    | "add_people"
    | "remove_people"
    | "update_people"
    | "update_room_show_points";
  payload?: {
    id?: string;
    name?: string;
    showPoints?: boolean;
    people?: Partial<People>;
  };
}

interface RoomContextProps {
  createRoom(roomName: string): Promise<RoomInfo>;
  connectOnRoom(roomId: string, peopleName: string): Promise<() => void>;
  disconnectOnRoom(): Promise<void>;
  selectPoint(points: number): Promise<void>;
  setRoomPointsVisibility(show?: boolean): Promise<void>;
  room?: RoomInfo;
  peerId: number;
  me?: People;
  showPointsCountdown: number;
}

const RoomContext = createContext({} as RoomContextProps);

function roomReducer(state: RoomInfo, action: RoomReducerAction) {
  switch (action.type) {
    case "create":
      return {
        id: action.payload.id,
        name: action.payload.name,
        peoples: [],
      };
    case "add_people":
      const filteredPeoples = filterDistinctObjects(
        [...state.peoples, action.payload.people],
        "id"
      );

      return {
        ...state,
        peoples: filteredPeoples as People[],
      };
    case "remove_people":
      return {
        ...state,
        peoples: state.peoples.filter(
          (people) => people.id !== action.payload.people?.id
        ),
      };
    case "update_people":
      return {
        ...state,
        peoples: state.peoples.map((people) =>
          people.id === action.payload.people.id
            ? { ...people, ...action.payload.people }
            : people
        ),
      };
    case "update_room_show_points":
      return {
        ...state,
        showPoints: action.payload.showPoints,
        peoples: !action.payload.showPoints
          ? (state.peoples.map((people) => ({
              ...people,
              points: undefined,
            })) as People[])
          : state.peoples,
      };
  }
}

export function RoomContextProvider({ children }: RoomContextProviderProps) {
  const [room, updateRoom] = useReducer(roomReducer, undefined);
  const [peerId, setPeerId] = useState(-1);
  const [showPointsCountdown, setShowPointsCountdown] = useState(0);

  const me = room?.peoples.find((people) => people.id === peerId);

  const [peer] = useState(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const pusher = connectOnPusherWeb();

    pusher.connection.bind("connected", () => setPeerId(pusher.sessionID));

    return pusher;
  });

  useEffect(() => {
    if (showPointsCountdown > 0) {
      const timer = setInterval(
        () => setShowPointsCountdown(showPointsCountdown - 1),
        1000
      );

      return () => clearInterval(timer);
    }
  }, [showPointsCountdown]);

  function _prepareRoomConnection(channel: Channel, senderPeople: People) {
    channel.bind_global((event) => console.log("[pusher events]", event));

    channel.bind(`LOAD_PEOPLE:${peer.sessionID}`, (people: People) => {
      updateRoom({
        type: "add_people",
        payload: {
          people,
        },
      });
    });

    channel.bind("PEOPLE_ENTER", async (people: People) => {
      updateRoom({
        type: "add_people",
        payload: {
          people,
        },
      });

      if (people.id !== peer.sessionID) {
        await api.post("/events/load-people", {
          recipient_id: people.id,
          room_id: channel.name,
          people: senderPeople,
        });
      }
    });

    channel.bind("PEOPLE_LEAVE", (people: People) => {
      updateRoom({
        type: "remove_people",
        payload: {
          people,
        },
      });
    });

    channel.bind("SELECT_POINT", (people: People) => {
      if (senderPeople.id !== people.id) {
        updateRoom({
          type: "update_people",
          payload: {
            people: {
              id: people.id,
              points: people.points,
            },
          },
        });
      }
    });

    channel.bind("SHOW_POINTS", ({ show }) => {
      if (show) {
        setShowPointsCountdown(3);
      }

      updateRoom({
        type: "update_room_show_points",
        payload: {
          showPoints: show,
        },
      });
    });

    return () => {
      channel.unbind_all();
    };
  }

  function _unsubscribeAll() {
    const subscriptions = peer.allChannels();

    for (const subscription of subscriptions) {
      subscription.unbind_all();
      subscription.unsubscribe();
    }

    peer.unbind_all();
  }

  async function createRoom(roomName: string) {
    const { data: roomInfo } = await api.post<RoomInfo>("/create-room", {
      name: roomName,
    });

    return roomInfo;
  }

  async function connectOnRoom(roomId: string, peopleName: string) {
    _unsubscribeAll();

    const subscription = peer.subscribe(roomId);
    const { data } = await api.get("/get-room-name", {
      params: {
        room_id: roomId,
      },
    });

    const senderPeople: People = {
      id: peer.sessionID,
      name: peopleName,
    };

    const preparedRoom = _prepareRoomConnection(subscription, senderPeople);

    updateRoom({
      type: "create",
      payload: {
        id: roomId,
        name: data.name,
      },
    });

    await api.post("/events/people-enter", {
      people: senderPeople,
      room_id: roomId,
    });

    return preparedRoom;
  }

  async function disconnectOnRoom() {
    _unsubscribeAll();

    if (!room) {
      return;
    }

    await api.post("/events/people-leave", {
      people_id: peer.sessionID,
      room_id: room.id,
    });
  }

  async function selectPoint(points: number) {
    updateRoom({
      type: "update_people",
      payload: {
        people: {
          id: peerId,
          points,
        },
      },
    });

    await api.post("/events/select-point", {
      room_id: room.id,
      people: {
        id: peerId,
        points,
      },
    });
  }

  async function setRoomPointsVisibility(show?: boolean) {
    await api.post("/events/room-show-points", {
      room_id: room.id,
      show,
    });
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
        peerId,
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
