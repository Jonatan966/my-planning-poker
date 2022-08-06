import Peer, { DataConnection } from "peerjs";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import cloneDeep from "lodash.clonedeep";

import { PointCardModes } from "../components/point-card";

export interface People {
  id: string;
  connectionId?: string;
  name: string;
  isHost?: boolean;
  points?: number;
  mode: PointCardModes;
}

interface Room {
  id: string;
  name: string;
  peoples: People[];
}

interface RoomContextProviderProps {
  children: ReactNode;
}

interface RoomContextParams {
  connectOnRoom(id: string, peopleName: string): Promise<Room>;
  createRoom(roomName: string, hostName: string): string;
  selectPoint(point: number): void;
  activeRoom?: Room;
  people?: People;
}

interface RoomEvent {
  type: "people_enter" | "people_leave" | "people_change_data";
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

export function RoomContextProvider({ children }: RoomContextProviderProps) {
  const [peer] = useState(new Peer());
  const [activeRoom, setActiveRoom] = useState<Room>();

  const people = activeRoom
    ? activeRoom.peoples.find((people) => people.id === peer.id)
    : undefined;

  function onReceiveData(people: People) {
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

  useEffect(() => {
    async function onPeopleDisconnect(peopleId: string) {
      setActiveRoom((oldActiveRoom) => {
        const updatedActiveRoom = removePeopleFromRoom(
          oldActiveRoom as Room,
          peopleId
        );

        sendEventToAllPeoples(peer, {
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
          sendEventToAllPeoples(peer, {
            type: "people_enter",
            peopleId: connection.peer,
            room: updatedActiveRoom,
          });
        });

        connection.on("data", (data) => {
          const typedData = data as RoomEvent;

          if (typedData.people) {
            onReceiveData(typedData.people);
          }
        });

        connection.once("close", () => onPeopleDisconnect(connection.peer));

        return updatedActiveRoom;
      });
    }

    peer.on("connection", onPeopleConnect);

    return () => {
      peer.off("connection", onPeopleConnect);
    };
  }, []);

  function createRoom(roomName: string, hostName: string) {
    setActiveRoom({
      id: peer.id,
      name: roomName,
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

    onReceiveData(peopleClone);
  }

  return (
    <RoomContext.Provider
      value={{
        connectOnRoom,
        createRoom,
        selectPoint,
        activeRoom,
        people,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export const useRoom = () => useContext(RoomContext);
