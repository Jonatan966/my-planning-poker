import { PresenceChannel } from "pusher-js";
import { useReducer } from "react";
import { People, RoomInfo } from "./types";

interface RoomReducerAction {
  type:
    | "create"
    | "reset"
    | "add_people"
    | "remove_people"
    | "update_people"
    | "update_room_show_points";
  payload?: {
    id?: string;
    name?: string;
    subscription?: PresenceChannel;
    showPoints?: boolean;
    people?: Partial<People>;
    peoples?: Partial<People>[];
  };
}

function roomReducer(state: RoomInfo, action: RoomReducerAction) {
  switch (action.type) {
    case "create":
      return {
        id: action.payload.id,
        name: action.payload.name,
        subscription: action.payload.subscription,
        peoples: (action.payload?.peoples as People[]) || state?.peoples || [],
      };

    case "add_people":
      const { people, peoples = [] } = action.payload;

      const updatedPeoples = state.peoples.concat(
        (people as People) || (peoples as People[])
      );

      return {
        ...state,
        peoples: updatedPeoples,
      };

    case "remove_people":
      return {
        ...state,
        peoples: state.peoples.filter(
          (people) => people.id !== action.payload.people?.id
        ),
      };

    case "update_people":
      return {
        ...state,
        peoples: state.peoples.map((people) =>
          people.id === action.payload.people.id
            ? { ...people, ...action.payload.people }
            : people
        ),
      };

    case "update_room_show_points":
      return {
        ...state,
        showPoints: action.payload.showPoints,
        peoples: !action.payload.showPoints
          ? (state.peoples.map((people) => ({
              ...people,
              points: undefined,
            })) as People[])
          : state.peoples,
      };

    case "reset":
      return {
        id: undefined,
        name: undefined,
        subscription: undefined,
        peoples: [] as People[],
      };
  }
}

export const useRoomReducer = () =>
  useReducer(roomReducer, {
    id: undefined,
    name: undefined,
    subscription: undefined,
    peoples: [] as People[],
  });