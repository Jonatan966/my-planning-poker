export type FeedbackType = "problem" | "suggestion";

export enum FreeVaultEvent {
  people_send_feedback = "mpp_people_send_feedback",
}

export enum WebhookVaultEvent {
  room_people_enter = "mpp_room_people_enter",
  room_people_leave = "mpp_room_people_leave",
  room_show_points = "mpp_room_show_points",
  room_show_afk_alert = "mpp_room_show_afk_alert",
  people_select_point = "mpp_people_select_point",
  people_fire_confetti = "mpp_people_fire_confetti",
  people_inactivate = "mpp_people_inactivate",
}

export interface BasicEventProps {
  people_id: string;
}

export namespace WebhookVaultEventHandlers {
  export interface BasicRoomEventProps extends BasicEventProps {
    event_sended_at: Date;
    room_id: string;
  }

  export interface OnRoomPeopleEnterProps extends BasicRoomEventProps {}

  export interface OnRoomPeopleLeaveProps extends BasicRoomEventProps {}

  export interface OnRoomShowPointsProps extends BasicRoomEventProps {
    show_points: boolean;
  }

  export interface OnRoomShowAfkAlertProps extends BasicRoomEventProps {}

  export interface OnPeopleSelectPointProps extends BasicRoomEventProps {
    people_selected_points: number;
  }

  export interface OnPeopleFireConfettiProps extends BasicRoomEventProps {}

  export interface OnPeopleInactivateProps extends BasicRoomEventProps {
    has_confirmed_activity: boolean;
  }
}

export namespace FreeVaultEventHandlers {
  export interface OnPeopleSendFeedback extends BasicEventProps {
    feedback_type: FeedbackType;
  }
}
