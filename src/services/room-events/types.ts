export enum InternalRoomEvents {
  PEOPLE_ENTER = "pusher:member_added",
  PEOPLE_LEAVE = "pusher:member_removed",
  PREPARE_ROOM = "pusher:subscription_succeeded",
}

export enum ClientRoomEvents {
  ROOM_SYNC_PEOPLE = "people-ROOM_SYNC_PEOPLE",
  ROOM_SHOW_POINTS = "client-room_show_points",
  PEOPLE_SELECT_POINT = "client-people_select_point",
  PEOPLE_FIRE_CONFETTI = "client-people_fire_confetti",
}

export interface OnPeopleSelectPointProps {
  people_id: string;
  people_selected_points: number;
}

export interface OnRoomShowPointsProps {
  show_points: boolean;
  room_countdown_started_at: number;
}

export interface OnPeopleFireConfettiProps {
  people_id: string;
}

export interface OnRoomSyncPeopleProps {
  target_people_id: string;
  people_id: string;
  selected_points: number;
  room_countdown_started_at?: number;
}
