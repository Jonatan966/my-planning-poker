import pusherJs, { PresenceChannel } from "pusher-js";
import { StateCreator } from "zustand";

export enum EventMode {
  PUBLIC,
  PRIVATE,
}

export interface People {
  id?: string;
  name: string;
  entered_at: Date;
  points?: number;
  highlight?: boolean;
}

export interface RoomInfo {
  name: string;
  id: string;
  subscription: PresenceChannel;
  showPoints?: boolean;
  peoples?: People[];
}

export type BasicRoomInfo = Pick<RoomInfo, "name" | "id">;

export interface RoomContextProps {
  createRoom(roomName: string): Promise<RoomInfo>;
  connectOnRoom(basicRoomInfo: BasicRoomInfo): Promise<() => void>;
  disconnectOnRoom(): void;
  selectPoint(points: number): Promise<void>;
  setRoomPointsVisibility(show?: boolean): Promise<void>;
  room?: RoomInfo;
  me?: People;
  showPointsCountdown: number;
}

export interface RoomStoreProps {
  basicInfo: {
    id?: string;
    name?: string;
    showPoints: boolean;
    showPointsCountdown?: number;
    subscription?: PresenceChannel;
  };
  peoples: People[];
  connection?: pusherJs;
  showEasterEgg?: boolean;
  setEasterEggVisibility(visible: boolean): void;
  createRoom(roomName: string): Promise<RoomInfo>;
  connectOnRoom(roomBasicInfo: BasicRoomInfo): Promise<() => void>;
  disconnectOnRoom(): void;
  selectPoint(points: number): Promise<void>;
  setRoomPointsVisibility(show?: boolean, mode?: EventMode): Promise<void>;
  broadcastConfetti(): void;
  broadcastAfkAlert(): void;
  setPeopleHighlight(people_id: string, highlight?: boolean): void;
}

export type MountRoomEventsProps = Parameters<
  StateCreator<RoomStoreProps, [], [], RoomStoreProps>
>;

export interface OnLoadPeopleProps {
  id: string;
  info: {
    name: string;
    entered_at: Date;
  };
}

export interface OnSyncPeopleProps {
  id: string;
  points: number;
}

export interface OnHighlightPeopleProps {
  sender_id: string;
  highlight?: boolean;
}
