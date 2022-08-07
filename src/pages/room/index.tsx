import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataConnection } from "peerjs";

import PointsList from "../../components/domain/points-list";
import RoomHeader from "../../components/domain/room-header";
import styles from "./styles.module.css";
import Table from "../../components/domain/table";
import { useRoom } from "../../contexts/room-context";
import ConnectionModal from "../../components/domain/connection-modal";

function RoomPage() {
  const { room_id = "" } = useParams();
  const { connectOnRoom, leaveRoom, peer, isReady, activeRoom } = useRoom();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function handleConnectOnRoom() {
      const peopleName = localStorage.getItem("@planning:people-name") || "";

      if (room_id !== peer.id && activeRoom?.id !== room_id) {
        await connectOnRoom(room_id, JSON.parse(peopleName));
      }

      setIsLoading(false);
    }

    if (isReady) {
      handleConnectOnRoom();
    }
  }, [isReady]);

  function onCancelRoomConnection() {
    navigate("/");
    leaveRoom();
    setIsLoading(false);
  }

  return (
    <>
      <ConnectionModal
        isOpen={isLoading}
        onRequestClose={onCancelRoomConnection}
      />

      <RoomHeader />

      <main className={styles.mainConatainer}>
        <Table />
      </main>

      <PointsList />
    </>
  );
}

export default RoomPage;
