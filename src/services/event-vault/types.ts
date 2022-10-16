export enum VaultEvent {
  room_people_enter = "mpp_room_people_enter",
  room_people_leave = "mpp_room_people_leave",
  room_show_points = "mpp_room_show_points",
  people_select_point = "mpp_people_select_point",
  people_fire_confetti = "mpp_people_fire_confetti",
}

export namespace VaultEventHandlers {
  export interface BasicEventProps {
    room_id: string;
    people_id: string;
    event_sended_at: Date;
  }

  export interface OnRoomPeopleEnterProps extends BasicEventProps {}

  export interface OnRoomPeopleLeaveProps extends BasicEventProps {}

  export interface OnRoomShowPointsProps extends BasicEventProps {
    show_points: boolean;
    countdown_started_at: number;
  }

  export interface OnPeopleSelectPointProps extends BasicEventProps {
    people_selected_points: number;
  }

  export interface OnPeopleFireConfettiProps extends BasicEventProps {}
}
