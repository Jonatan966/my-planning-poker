import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PointsList from "../../components/domain/points-list";
import RoomHeader from "../../components/domain/room-header";
import styles from "./styles.module.css";
import Table from "../../components/domain/table";
import { useRoom } from "../../contexts/room-context";
import { DataConnection } from "peerjs";

function RoomPage() {
  const { room_id = "" } = useParams();
  const { connectOnRoom, peer, isReady } = useRoom();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function handleConnectOnRoom() {
      const peopleName = localStorage.getItem("@planning:people-name") || "";

      if (room_id !== peer.id) {
        await connectOnRoom(room_id, JSON.parse(peopleName));
      }

      setIsLoading(false);
    }

    if (
      isReady &&
      !(peer.connections as Record<string, DataConnection[]>)[room_id]?.length
    ) {
      handleConnectOnRoom();
    }
  }, [isReady]);

  return (
    <>
      {isLoading && <h1>Carregando...</h1>}
      <RoomHeader />

      <main className={styles.mainConatainer}>
        <Table />
      </main>

      <PointsList />
    </>
  );
}

export default RoomPage;
