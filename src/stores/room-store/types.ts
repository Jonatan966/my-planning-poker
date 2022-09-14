import pusherJs, { PresenceChannel } from "pusher-js";

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
  SYNC_PEOPLE_POINTS = "people-SYNC_PEOPLE_POINTS",
  LOAD_PEOPLE = "pusher:member_added",
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
  setRoomPointsVisibility(show?: boolean): Promise<void>;
}
