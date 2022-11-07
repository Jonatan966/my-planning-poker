import { FeedbackType } from "@prisma/client";

export enum FreeVaultEvent {
  people_send_feedback = "mpp_people_send_feedback",
}

export enum WebhookVaultEvent {
  room_people_enter = "mpp_room_people_enter",
  room_people_leave = "mpp_room_people_leave",
  room_show_points = "mpp_room_show_points",
  people_select_point = "mpp_people_select_point",
  people_fire_confetti = "mpp_people_fire_confetti",
}

export interface BasicEventProps {
  environment: string;
}

export namespace WebhookVaultEventHandlers {
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
}

export namespace FreeVaultEventHandlers {
  export interface OnPeopleSendFeedback extends BasicEventProps {
    feedback_type: FeedbackType;
  }
}
