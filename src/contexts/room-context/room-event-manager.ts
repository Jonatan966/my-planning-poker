import { Members, PresenceChannel } from "pusher-js";
import { useState, useEffect } from "react";
import { useRoomReducer } from "./room-reducer";
import { People, MainRoomEvents } from "./types";

export function useRoomEventManager() {
  const [showPointsCountdown, setShowPointsCountdown] = useState(0);
  const [room, updateRoom] = useRoomReducer();

  function onLoadPeople(people: any) {
    updateRoom({
      type: "add_people",
      payload: {
        people: {
          id: people.id,
          name: people.info.name,
        },
      },
    });
  }

  function onPrepareRoom(roomPeoples: Members) {
    const parsedMembers = Object.entries<People>(roomPeoples.members).map<
      Partial<People>
    >(([id, people]) => ({
      id,
      name: people.name,
    }));

    updateRoom({
      type: "add_people",
      payload: {
        peoples: parsedMembers,
      },
    });
  }

  function onPeopleLeave(people: People) {
    updateRoom({
      type: "remove_people",
      payload: {
        people,
      },
    });
  }

  function onSelectPoint(people: Pick<People, "id" | "points">) {
    updateRoom({
      type: "update_people",
      payload: {
        people: {
          id: people.id,
          points: people.points,
        },
      },
    });
  }

  function onShowPoints({ show }: { show: boolean }) {
    if (show) {
      setShowPointsCountdown(3);
    }

    updateRoom({
      type: "update_room_show_points",
      payload: {
        showPoints: show,
      },
    });
  }

  function prepareRoomConnection(subscription: PresenceChannel) {
    subscription.bind_global((event) => console.log("[pusher events]", event));
    subscription.bind(MainRoomEvents.LOAD_PEOPLE, onLoadPeople);
    subscription.bind(MainRoomEvents.PREPARE_ROOM, onPrepareRoom);
    subscription.bind(MainRoomEvents.PEOPLE_LEAVE, onPeopleLeave);
    subscription.bind(MainRoomEvents.SELECT_POINT, onSelectPoint);
    subscription.bind(MainRoomEvents.SHOW_POINTS, onShowPoints);

    return () => {
      subscription.unbind_all();
    };
  }

  useEffect(() => {
    if (showPointsCountdown > 0) {
      const timer = setInterval(
        () => setShowPointsCountdown(showPointsCountdown - 1),
        1000
      );

      return () => clearInterval(timer);
    }
  }, [showPointsCountdown]);

  const roomEvents = {
    onLoadPeople,
    onPrepareRoom,
    onPeopleLeave,
    onSelectPoint,
    onShowPoints,
  };

  return {
    showPointsCountdown,
    room,
    roomEvents,
    updateRoom,
    prepareRoomConnection,
  };
}
