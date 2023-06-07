import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  ClientRoomEvents,
  InternalRoomEvents,
} from "../../../services/room-events";

import { useRoomStore } from "../../../stores/room-store";
import { useVisitsStore } from "../../../stores/visits-store";
import Dialog from "../../ui/dialog";
import { ConnectingMessage } from "./connecting-message";
import { PeopleForm } from "./people-form";

import styles from "./styles.module.css";

interface ConnectionDialogProps {
  isOpen?: boolean;
  onRequestClose: () => void;
  basicMe: {
    name?: string;
  };
  roomInfo: {
    id: string;
    name: string;
    countdown_started_at?: number;
    created_at: Date;
  };
}

function ConnectionDialog({
  onRequestClose,
  isOpen,
  basicMe,
  roomInfo,
}: ConnectionDialogProps) {
  const router = useRouter();
  const { connectOnRoom, disconnectOnRoom, room, connection } = useRoomStore(
    (state) => ({
      connectOnRoom: state.connectOnRoom,
      disconnectOnRoom: state.disconnectOnRoom,
      setRoomPointsVisibility: state.setRoomPointsVisibility,
      room: state.basicInfo,
      connection: state.connection,
    })
  );

  const { addVisit } = useVisitsStore((state) => ({
    addVisit: state.addVisit,
  }));

  const [isConnectingIntoRoom, setIsConnectingIntoRoom] = useState(true);

  const [isFillPeopleName, setIsFillPeopleName] = useState(
    () => !!basicMe?.name
  );

  const isInitialInteraction = useRef(true);
  const connectionDebounceTimer = useRef(0);

  async function onCancelRoomConnection() {
    await router.replace("/");
    disconnectOnRoom();
    onRequestClose();
  }

  async function handleConnectOnRoom() {
    try {
      return await connectOnRoom(roomInfo);
    } catch (e) {
      console.log(e);
      toast.error("Não foi possível se conectar a essa sala");
      router.replace("/");
    }
  }

  function renderContent() {
    if (!isFillPeopleName) {
      return (
        <PeopleForm
          onCancelRoomConnection={onCancelRoomConnection}
          setIsFillPeopleName={setIsFillPeopleName}
        />
      );
    }

    return (
      <ConnectingMessage onCancelRoomConnection={onCancelRoomConnection} />
    );
  }

  useEffect(() => {
    if (!isFillPeopleName || !router.query.room_id) {
      return;
    }

    let disconnect: () => void;

    addVisit(roomInfo);
    handleConnectOnRoom().then((onDisconnect) => (disconnect = onDisconnect));

    return () => {
      setTimeout(disconnect, 1);
    };
  }, [isFillPeopleName, router.query]);

  useEffect(() => {
    if (isInitialInteraction.current) {
      isInitialInteraction.current = false;
      return;
    }

    if (!isConnectingIntoRoom) {
      onRequestClose();
    }
  }, [isConnectingIntoRoom]);

  useEffect(() => {
    if (!room?.subscription) return;

    function debounceConnectionLoad() {
      clearTimeout(connectionDebounceTimer.current);

      const DEBOUNCE_DELAY = 500; // Half second (1/2 second)

      if (connectionDebounceTimer.current > -1) {
        connectionDebounceTimer.current = window.setTimeout(() => {
          setIsConnectingIntoRoom(false);
          connectionDebounceTimer.current = -1;
        }, DEBOUNCE_DELAY);
      }
    }

    room.subscription.bind(
      InternalRoomEvents.PREPARE_ROOM,
      debounceConnectionLoad
    );
    room.subscription.bind(
      InternalRoomEvents.PEOPLE_ENTER,
      debounceConnectionLoad
    );
    connection.bind(ClientRoomEvents.ROOM_SYNC_PEOPLE, debounceConnectionLoad);

    debounceConnectionLoad();

    return () => {
      room.subscription.unbind(
        InternalRoomEvents.PREPARE_ROOM,
        debounceConnectionLoad
      );
      room.subscription.unbind(
        InternalRoomEvents.PEOPLE_ENTER,
        debounceConnectionLoad
      );
      connection.unbind(
        ClientRoomEvents.ROOM_SYNC_PEOPLE,
        debounceConnectionLoad
      );
    };
  }, [room?.subscription]);

  return (
    <Dialog
      isOpen={isOpen}
      onRequestClose={onCancelRoomConnection}
      className={classNames(styles.dialogContainer, {
        [styles.isLoading]: isFillPeopleName,
      })}
    >
      {renderContent()}
    </Dialog>
  );
}

export default ConnectionDialog;
