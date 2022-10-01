import { Room } from "@prisma/client";

export type Visits = Record<string, Room>;

export interface VisitsStoreProps {
  visits: Visits;
  addVisit(room: Room): void;
  removeVisit(roomId: string): void;
}
