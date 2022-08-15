import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import PointsList from "../../components/domain/points-list";
import RoomHeader from "../../components/domain/room-header";
import Table from "../../components/domain/table";
import ConnectionModal from "../../components/domain/connection-modal";
import { useRoom } from "../../contexts/room-context";

import styles from "../../styles/pages/room.module.css";

function RoomPage() {
  const router = useRouter();
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
        roomId={router.query.room_id}
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
