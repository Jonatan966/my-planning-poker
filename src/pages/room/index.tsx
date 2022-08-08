import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PointsList from "../../components/domain/points-list";
import RoomHeader from "../../components/domain/room-header";
import styles from "./styles.module.css";
import Table from "../../components/domain/table";
import ConnectionModal from "../../components/domain/connection-modal";
import { useRoom } from "../../contexts/room-context";

function RoomPage() {
  const { room_id = "" } = useParams();
  const { activeRoom } = useRoom();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (activeRoom?.hasLostConnection) {
      setIsLoading(true);
    }
  }, [activeRoom]);

  return (
    <>
      <ConnectionModal
        isOpen={isLoading}
        onRequestClose={() => setIsLoading(false)}
        roomId={room_id}
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
