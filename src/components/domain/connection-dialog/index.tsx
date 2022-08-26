import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRoom } from "../../../contexts/room-context";
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
  const { connectOnRoom, disconnectOnRoom, peerId } = useRoom();

  const [isFillPeopleName, setIsFillPeopleName] = useState(
    () => !!storageManager.getItem("@planning:people-name")
  );

  async function onCancelRoomConnection() {
    await disconnectOnRoom();
    onRequestClose();
    router.replace("/");
  }

  async function handleConnectOnRoom() {
    const roomId = router.query.room_id as string;
    const peopleName = storageManager.getItem("@planning:people-name");

    await connectOnRoom(roomId, peopleName);

    onRequestClose();
  }

  function renderContent() {
    if (isFillPeopleName) {
      return (
        <ConnectingMessage onCancelRoomConnection={onCancelRoomConnection} />
      );
    }

    return (
      <PeopleForm
        onCancelRoomConnection={onCancelRoomConnection}
        setIsFillPeopleName={setIsFillPeopleName}
      />
    );
  }

  useEffect(() => {
    if (!isFillPeopleName || !router.query.room_id || !peerId) {
      return;
    }

    handleConnectOnRoom();
  }, [isFillPeopleName, peerId]);

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
