import { Room } from "@prisma/client";

export type Visits = Record<string, Room>;

export interface VisitsStoreProps {
  visits: Visits;
  lastVisitedRoom?: Room;
  addVisit(room: Omit<Room, "countdown_started_at">): void;
  removeVisit(roomId: string): void;
}
