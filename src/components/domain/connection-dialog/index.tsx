import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MainRoomEvents, useRoom } from "../../../contexts/room-context";
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
  const { connectOnRoom, disconnectOnRoom, peerId, room } = useRoom();

  const [isConnectingIntoRoom, setIsConnectingIntoRoom] = useState(true);

  const [isFillPeopleName, setIsFillPeopleName] = useState(
    () => !!storageManager.getItem("@planning:people-name")
  );

  const isInitialInteraction = useRef(true);
  const connectionDebounceTimer = useRef(0);

  async function onCancelRoomConnection() {
    await router.replace("/");
    await disconnectOnRoom();
    onRequestClose();
  }

  async function handleConnectOnRoom() {
    const roomId = router.query.room_id as string;
    const peopleName = storageManager.getItem("@planning:people-name");

    try {
      await connectOnRoom(roomId, peopleName);
    } catch {
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
    if (!isFillPeopleName || !router.query.room_id || !peerId) {
      return;
    }

    handleConnectOnRoom();
  }, [isFillPeopleName, peerId]);

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
        window.setTimeout(() => {
          setIsConnectingIntoRoom(false);
          connectionDebounceTimer.current = -1;
        }, 750);
      }
    }

    const peopleID = room.subscription.pusher.sessionID;

    room.subscription.bind(MainRoomEvents.PEOPLE_ENTER, debounceConnectionLoad);
    room.subscription.bind(`LOAD_PEOPLE:${peopleID}`, debounceConnectionLoad);

    return () => {
      room.subscription.unbind(
        MainRoomEvents.PEOPLE_ENTER,
        debounceConnectionLoad
      );
      room.subscription.unbind(
        `LOAD_PEOPLE:${peopleID}`,
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
