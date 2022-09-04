import { PresenceChannel } from "pusher-js";
import { ReactNode } from "react";

export interface RoomContextProviderProps {
  children: ReactNode;
}

export interface People {
  id?: string;
  name: string;
  points?: number;
}

export enum MainRoomEvents {
  PREPARE_ROOM = "pusher:subscription_succeeded",
  PEOPLE_LEAVE = "pusher:member_removed",
  SELECT_POINT = "client-SELECT_POINT",
  SHOW_POINTS = "client-SHOW_POINTS",
  LOAD_PEOPLE = "pusher:member_added",
}

export interface RoomInfo {
  name: string;
  id: string;
  subscription: PresenceChannel;
  showPoints?: boolean;
  peoples?: People[];
}

export interface RoomContextProps {
  createRoom(roomName: string): Promise<RoomInfo>;
  connectOnRoom(roomId: string): Promise<() => void>;
  disconnectOnRoom(): void;
  selectPoint(points: number): Promise<void>;
  setRoomPointsVisibility(show?: boolean): Promise<void>;
  room?: RoomInfo;
  me?: People;
  showPointsCountdown: number;
}
