import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRoom } from "../../../contexts/room-context";
import { MainRoomEvents } from "../../../contexts/room-context/types";
import { cookieStorageManager } from "../../../utils/cookie-storage-manager";
import { storageManager } from "../../../utils/storage-manager";
import Dialog from "../../ui/dialog";
import { ConnectingMessage } from "./connecting-message";
import { PeopleForm } from "./people-form";

import styles from "./styles.module.css";

interface ConnectionDialogProps {
  isOpen?: boolean;
  onRequestClose: () => void;
}

function ConnectionDialog({ onRequestClose, isOpen }: ConnectionDialogProps) {
  const router = useRouter();
  const { connectOnRoom, disconnectOnRoom, room } = useRoom();

  const [isConnectingIntoRoom, setIsConnectingIntoRoom] = useState(true);

  const [isFillPeopleName, setIsFillPeopleName] = useState(
    () => !!cookieStorageManager.getItem("@planning:people-name")
  );

  const isInitialInteraction = useRef(true);
  const connectionDebounceTimer = useRef(0);

  async function onCancelRoomConnection() {
    await router.replace("/");
    disconnectOnRoom();
    onRequestClose();
  }

  async function handleConnectOnRoom() {
    const roomId = router.query.room_id as string;

    try {
      await connectOnRoom(roomId);
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

    handleConnectOnRoom();
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

      if (connectionDebounceTimer.current > -1) {
        connectionDebounceTimer.current = window.setTimeout(() => {
          setIsConnectingIntoRoom(false);
          connectionDebounceTimer.current = -1;
        }, 750);
      }
    }

    room.subscription.bind(MainRoomEvents.PREPARE_ROOM, debounceConnectionLoad);
    room.subscription.bind(MainRoomEvents.LOAD_PEOPLE, debounceConnectionLoad);

    debounceConnectionLoad();

    return () => {
      room.subscription.unbind(
        MainRoomEvents.PREPARE_ROOM,
        debounceConnectionLoad
      );
      room.subscription.unbind(
        MainRoomEvents.LOAD_PEOPLE,
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
