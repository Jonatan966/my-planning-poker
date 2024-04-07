export interface VisitsStoreProps {
  lastVisitedRoomId?: string;
  addVisit(room_id: string): void;
}
