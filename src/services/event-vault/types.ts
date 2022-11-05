import { FeedbackType } from "@prisma/client";

export enum VaultEvent {
  room_people_enter = "mpp_room_people_enter",
  room_people_leave = "mpp_room_people_leave",
  room_show_points = "mpp_room_show_points",
  people_select_point = "mpp_people_select_point",
  people_fire_confetti = "mpp_people_fire_confetti",
  people_send_feedback = "mpp_people_send_feedback",
}

export namespace VaultEventHandlers {
  export interface BasicEventProps {
    environment: string;
  }

  export interface BasicRoomEventProps extends BasicEventProps {
    event_sended_at: Date;
    room_id: string;
    people_id: string;
  }

  export interface OnRoomPeopleEnterProps extends BasicRoomEventProps {}

  export interface OnRoomPeopleLeaveProps extends BasicRoomEventProps {}

  export interface OnRoomShowPointsProps extends BasicRoomEventProps {
    show_points: boolean;
  }

  export interface OnPeopleSelectPointProps extends BasicRoomEventProps {
    people_selected_points: number;
  }

  export interface OnPeopleFireConfettiProps extends BasicRoomEventProps {}

  export interface OnPeopleSendFeedback extends BasicEventProps {
    room_id?: string;
    feedback_type: FeedbackType;
  }
}
