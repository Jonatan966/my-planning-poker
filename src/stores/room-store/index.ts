import pusherJs, { PresenceChannel } from "pusher-js";
import createStore, { StateCreator } from "zustand";

import { api } from "../../lib/ky";
import { createWebConnection } from "../../lib/pusher";
import { mountRoomHandler } from "./mount-room-handler";

import {
  ClientRoomEvents,
  InternalRoomEvents,
  OnPeopleFireConfettiProps,
  OnPeopleInactivateProps,
  roomEvents,
} from "../../services/room-events";
import {
  BasicRoomInfo,
  EventMode,
  PeopleHighlightColor,
  RoomInfo,
  RoomStoreProps,
} from "./types";

let connection: pusherJs;

const roomStore: StateCreator<RoomStoreProps, [], [], RoomStoreProps> = (
  set,
  get
) => {
  const roomHandler = mountRoomHandler(set, get);

  const INITIAL_STORE_VALUE: RoomStoreProps = {
    basicInfo: {
      id: undefined,
      name: undefined,
      showPoints: false,
      showPointsCountdown: 0,
      subscription: undefined,
    },
    peoples: {},
    showEasterEgg: false,
    hasPeopleWithPoints: false,
    setEasterEggVisibility,
    connectOnRoom,
    createRoom,
    disconnectOnRoom,
    selectPoint,
    setRoomPointsVisibility,
    broadcastConfetti,
    setPeoplesHighlight,
    broadcastAfkAlert,
    highlightAfkPeoples,
    hasMeWithoutPoints,
    broadcastInactivity,
  };

  function _reset() {
    set(INITIAL_STORE_VALUE, true);
  }

  function _createRoom(roomInfo: RoomInfo) {
    set({
      basicInfo: {
        showPoints: false,
        id: roomInfo.id,
        name: roomInfo.name,
        subscription: roomInfo.subscription,
        showPointsCountdown: 0,
      },
    });
  }

  function _logEvent(event: string) {
    console.log("[pusher events]", event);
  }

  function prepareRoomConnection(subscription: PresenceChannel) {
    subscription.bind_global(_logEvent);

    subscription.bind(
      InternalRoomEvents.PEOPLE_ENTER,
      roomHandler.onLoadPeople
    );
    subscription.bind(
      InternalRoomEvents.PREPARE_ROOM,
      roomHandler.onPrepareRoom
    );
    subscription.bind(
      InternalRoomEvents.PEOPLE_LEAVE,
      roomHandler.onPeopleLeave
    );
    subscription.bind(
      ClientRoomEvents.PEOPLE_SELECT_POINT,
      roomHandler.onSelectPoint
    );
    subscription.bind(
      ClientRoomEvents.ROOM_SHOW_POINTS,
      roomHandler.onShowPoints
    );
    subscription.bind(
      ClientRoomEvents.PEOPLE_FIRE_CONFETTI,
      (params: OnPeopleFireConfettiProps) =>
        roomHandler.onHighlightPeoples({
          peoples_id: [params.people_id],
          highlight: "cyan",
        })
    );
    subscription.bind(
      ClientRoomEvents.PEOPLE_INACTIVATE,
      (params: OnPeopleInactivateProps) => {
        roomHandler.onHighlightPeoples({
          peoples_id: [params.people_id],
          highlight: params?.has_confirmed_activity ? undefined : "red",
        });
      }
    );

    connection.user.bind(
      ClientRoomEvents.ROOM_SYNC_PEOPLE,
      roomHandler.onSyncPeople
    );

    return disconnectOnRoom;
  }

  function disconnectOnRoom() {
    if (!connection) {
      return;
    }

    const subscriptions = connection.allChannels() as PresenceChannel[];

    for (const subscription of subscriptions) {
      subscription.unbind_all();
      subscription.unbind_global();
    }

    connection.user.unbind_all();
    connection.unbind_all();
    connection.unbind_global();
    connection.disconnect();

    _reset();
  }

  async function createRoom(roomName: string) {
    const roomInfo = await api
      .post("rooms", {
        json: { name: roomName },
      })
      .json<RoomInfo>();

    return roomInfo;
  }

  async function connectOnRoom(roomBasicInfo: BasicRoomInfo) {
    connection = await createWebConnection();
    set({ connection });

    connection.user.signin();

    const subscription = connection.subscribe(
      `presence-${roomBasicInfo.id}`
    ) as PresenceChannel;

    const preparedRoom = prepareRoomConnection(subscription);

    const roomInfo: RoomInfo = {
      ...roomBasicInfo,
      subscription,
    };

    _createRoom(roomInfo);

    return preparedRoom;
  }

  async function selectPoint(points: number) {
    const { basicInfo, peoples } = get();

    const myID = basicInfo.subscription.members.myID;

    roomHandler.onSelectPoint({
      people_id: myID,
      people_selected_points: points,
    });

    roomEvents.onPeopleSelectPoint(basicInfo.subscription, {
      people_id: myID,
      people_selected_points: points,
    });

    const peoplesWithPoints = Object.values(peoples).filter(
      (people) => typeof people.points !== "undefined"
    ).length;

    const ableToShowPoints =
      peoplesWithPoints >= Object.keys(peoples).length - 1;

    if (ableToShowPoints) {
      await setRoomPointsVisibility(true);
    }
  }

  async function setRoomPointsVisibility(
    show?: boolean,
    mode: EventMode = EventMode.PUBLIC
  ) {
    const { basicInfo } = get();

    if (mode === EventMode.PUBLIC) {
      roomEvents.onRoomShowPoints(basicInfo.subscription, {
        show_points: show,
      });
    }

    roomHandler.onShowPoints({
      show_points: show,
    });
  }

  function setEasterEggVisibility(show: boolean) {
    set({ showEasterEgg: show });
  }

  function broadcastConfetti() {
    const { basicInfo } = get();

    roomEvents.onPeopleFireConfetti(basicInfo.subscription, {
      people_id: basicInfo.subscription.members.myID,
    });
  }

  function broadcastAfkAlert() {
    const { basicInfo } = get();

    roomEvents.onRoomShowAfkAlert(basicInfo.subscription, {
      people_id: basicInfo.subscription.members.myID,
    });
  }

  function broadcastInactivity(hasConfirmedActivity = false) {
    const { basicInfo } = get();

    roomEvents.onPeopleInactivate(basicInfo.subscription, {
      people_id: basicInfo.subscription.members.myID,
      has_confirmed_activity: hasConfirmedActivity,
    });
  }

  function setPeoplesHighlight(
    peoples_id: string[],
    highlight?: PeopleHighlightColor
  ) {
    roomHandler.onHighlightPeoples({
      peoples_id,
      highlight,
    });
  }

  function highlightAfkPeoples(delay: number, senderPeopleId?: string) {
    const { peoples } = get();

    const idsOfPeoplesWithoutPoints = Object.values(peoples).map((people) =>
      typeof people?.points === "undefined" ? people?.id : undefined
    );

    setPeoplesHighlight(idsOfPeoplesWithoutPoints, "orange");

    if (senderPeopleId) {
      setPeoplesHighlight([senderPeopleId], "cyan");
    }

    setTimeout(
      () => setPeoplesHighlight([...idsOfPeoplesWithoutPoints, senderPeopleId]),
      delay
    );
  }

  function hasMeWithoutPoints() {
    const { peoples, basicInfo } = get();

    const myID = basicInfo?.subscription?.members?.myID;

    return typeof peoples[myID]?.points === "undefined";
  }

  return INITIAL_STORE_VALUE;
};

export const useRoomStore = createStore<RoomStoreProps>(roomStore);
export * from "./types";
