import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import PointsList from "../../components/domain/points-list";
import RoomHeader from "../../components/domain/room-header";
import Table from "../../components/domain/table";

import styles from "../../styles/pages/room.module.css";
import { useRoom } from "../../contexts/room-context";
import { api } from "../../lib/axios";
import ConnectionDialog from "../../components/domain/connection-dialog";

function RoomPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const { peerId } = useRoom();

  useEffect(() => {
    const roomId = router.query.room_id as string;

    function onWindowClose() {
      navigator.sendBeacon(
        `${api.defaults.baseURL}/events/people-leave`,
        JSON.stringify({
          room_id: roomId,
          people_id: peerId,
        })
      );
    }

    window.addEventListener("beforeunload", onWindowClose);
    window.addEventListener("popstate", onWindowClose);

    return () => {
      window.removeEventListener("beforeunload", onWindowClose);
      window.removeEventListener("popstate", onWindowClose);
    };
  }, [router, peerId]);

  return (
    <>
      <RoomHeader />
      <ConnectionDialog
        isOpen={isLoading}
        onRequestClose={() => setIsLoading(false)}
      />
      {!isLoading && (
        <>
          <main className={styles.mainConatainer}>
            <Table />
          </main>

          <PointsList />
        </>
      )}
    </>
  );
}

export default RoomPage;
