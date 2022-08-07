import Peer, { DataConnection } from "peerjs";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import cloneDeep from "lodash.clonedeep";

import { PointCardModes } from "../components/domain/table/point-card";

export interface People {
  id: string;
  connectionId?: string;
  name: string;
  isHost?: boolean;
  points?: number;
  mode: PointCardModes;
}

type RoomMode = "scoring" | "count_average";

interface Room {
  id: string;
  name: string;
  mode: RoomMode;
  peoples: People[];
}

interface RoomContextProviderProps {
  children: ReactNode;
}

interface RoomContextParams {
  connectOnRoom(id: string, peopleName: string): Promise<Room>;
  createRoom(roomName: string, hostName: string): string;
  selectPoint(point: number): void;
  toggleRoomMode(): void;
  leaveRoom(): void;
  activeRoom?: Room;
  people?: People;
  peer: Peer;
  isReady: boolean;
}

interface RoomEvent {
  type:
    | "people_enter"
    | "people_leave"
    | "people_change_data"
    | "room_mode_change";
  people?: People;
  peopleId: string;
  room?: Room;
}

const RoomContext = createContext({} as RoomContextParams);

function sendEventToAllPeoples(peer: Peer, event: RoomEvent) {
  const peopleConnections = Object.values(
    peer.connections
  ) as DataConnection[][];

  for (const connections of peopleConnections) {
    if (!connections.length) {
      continue;
    }

    connections[0].send(event);
  }
}

function updatePeopleInRoom(oldRoom: Room, people: People) {
  const updatedRoom = cloneDeep(oldRoom);

  const storagedPeopleIndex = updatedRoom.peoples.findIndex(
    (storagedPeople) => storagedPeople.id === people.id
  );

  if (storagedPeopleIndex > -1) {
    updatedRoom.peoples[storagedPeopleIndex] = cloneDeep(people);
  }

  return updatedRoom;
}

function removePeopleFromRoom(oldRoom: Room, peopleId: string) {
  const updatedRoom = cloneDeep(oldRoom);

  updatedRoom.peoples = updatedRoom.peoples.filter(
    (people) => people.id !== peopleId
  );

  return updatedRoom;
}

function updateRoomMode(oldRoom: Room, newMode: RoomMode) {
  const updatedActiveRoom = cloneDeep(oldRoom);

  if (!updatedActiveRoom) {
    return;
  }

  updatedActiveRoom.mode = newMode;

  updatedActiveRoom.peoples = updatedActiveRoom.peoples.map((people) => ({
    ...people,
    mode: newMode === "count_average" ? "show-points" : "unready",
    points: newMode === "count_average" ? people.points : undefined,
  }));

  return updatedActiveRoom;
}

export function RoomContextProvider({ children }: RoomContextProviderProps) {
  const [peer, setPeer] = useState(new Peer());
  const [isReady, setIsReady] = useState(false);
  const [activeRoom, setActiveRoom] = useState<Room>();

  const people = activeRoom
    ? activeRoom.peoples.find((people) => people.id === peer.id)
    : undefined;

  function syncPeople(people: People) {
    setActiveRoom((oldActiveRoom) => {
      const updatedActiveRoom = updatePeopleInRoom(
        oldActiveRoom as Room,
        people
      );

      sendEventToAllPeoples(peer, {
        type: "people_change_data",
        peopleId: people.id,
        people,
      });

      return updatedActiveRoom;
    });
  }

  function syncRoomMode(newMode: RoomMode) {
    setActiveRoom((oldActiveRoom) => {
      const updatedActiveRoom = updateRoomMode(oldActiveRoom as Room, newMode);

      sendEventToAllPeoples(peer, {
        type: "room_mode_change",
        peopleId: people?.id || "",
        room: updatedActiveRoom,
      });

      return updatedActiveRoom;
    });
  }

  function preparePeer(targetPeer: Peer) {
    async function onPeopleDisconnect(peopleId: string) {
      setActiveRoom((oldActiveRoom) => {
        const updatedActiveRoom = removePeopleFromRoom(
          oldActiveRoom as Room,
          peopleId
        );

        sendEventToAllPeoples(targetPeer, {
          type: "people_leave",
          peopleId: peopleId,
        });

        return updatedActiveRoom;
      });
    }

    function onPeopleConnect(connection: DataConnection) {
      setActiveRoom((oldActiveRoom) => {
        const updatedActiveRoom = cloneDeep(oldActiveRoom as Room);

        if (
          !updatedActiveRoom.peoples.some(
            (people) => people.id === connection.connectionId
          )
        ) {
          updatedActiveRoom?.peoples.push({
            id: connection.peer,
            connectionId: connection.connectionId,
            name: connection.label,
            mode: "unready",
          });
        }

        connection.once("open", () => {
          sendEventToAllPeoples(targetPeer, {
            type: "people_enter",
            peopleId: connection.peer,
            room: updatedActiveRoom,
          });
        });

        connection.on("data", (data) => {
          const typedData = data as RoomEvent;

          switch (typedData.type) {
            case "people_change_data":
              syncPeople(typedData.people as People);
              break;
            case "room_mode_change":
              syncRoomMode(typedData.room?.mode as RoomMode);
              break;
          }
        });

        connection.once("close", () => onPeopleDisconnect(connection.peer));

        return updatedActiveRoom;
      });
    }

    function onReady() {
      setIsReady(true);
    }

    targetPeer.on("connection", onPeopleConnect);
    targetPeer.on("open", onReady);

    return () => {
      targetPeer.off("connection", onPeopleConnect);
      targetPeer.off("open", onReady);
    };
  }

  useEffect(() => preparePeer(peer), []);

  function createRoom(roomName: string, hostName: string) {
    setActiveRoom({
      id: peer.id,
      name: roomName,
      mode: "scoring",
      peoples: [
        {
          id: peer.id,
          mode: "unready",
          name: hostName,
          isHost: true,
        },
      ],
    });

    return peer.id;
  }

  async function connectOnRoom(id: string, peopleName: string) {
    return new Promise<Room>((resolve) => {
      const connection = peer.connect(id, {
        label: peopleName,
      });

      connection.on("data", (event) => {
        const parsedRoomEvent = event as RoomEvent;

        switch (parsedRoomEvent.type) {
          case "people_enter":
            setActiveRoom(parsedRoomEvent.room);
            resolve(parsedRoomEvent.room as Room);
            break;

          case "people_change_data":
            setActiveRoom((oldActiveRoom) => {
              const updatedActiveRoom = updatePeopleInRoom(
                oldActiveRoom as Room,
                parsedRoomEvent.people as People
              );

              return updatedActiveRoom;
            });
            break;

          case "people_leave":
            setActiveRoom((oldActiveRoom) => {
              const updatedActiveRoom = removePeopleFromRoom(
                oldActiveRoom as Room,
                parsedRoomEvent.peopleId
              );

              return updatedActiveRoom;
            });
            break;

          case "room_mode_change":
            setActiveRoom((oldActiveRoom) => {
              const updatedActiveRoom = updateRoomMode(
                oldActiveRoom as Room,
                parsedRoomEvent.room?.mode as RoomMode
              );

              return updatedActiveRoom;
            });
            break;
        }
      });
    });
  }

  function selectPoint(point: number) {
    if (!people) {
      return;
    }

    const peopleClone = cloneDeep(people);

    peopleClone.points = point;
    peopleClone.mode = "ready";

    syncPeople(peopleClone);
  }

  function toggleRoomMode() {
    syncRoomMode(activeRoom?.mode === "scoring" ? "count_average" : "scoring");
  }

  function leaveRoom() {
    peer.destroy();

    setIsReady(false);
    setActiveRoom(undefined);

    const rebuildedPeer = new Peer();
    preparePeer(rebuildedPeer);

    setPeer(rebuildedPeer);
  }

  return (
    <RoomContext.Provider
      value={{
        connectOnRoom,
        createRoom,
        selectPoint,
        toggleRoomMode,
        leaveRoom,
        activeRoom,
        peer,
        people,
        isReady,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export const useRoom = () => useContext(RoomContext);
