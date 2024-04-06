export type Room = {
  id: string;
};

export type Visits = Record<string, Room>;

export interface VisitsStoreProps {
  visits: Visits;
  lastVisitedRoom?: Room;
  addVisit(room: Room): void;
  removeVisit(roomId: string): void;
}
