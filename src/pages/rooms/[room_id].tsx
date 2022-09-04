import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import PointsList from "../../components/domain/points-list";
import RoomHeader from "../../components/domain/room-header";
import Table from "../../components/domain/table";

import styles from "../../styles/pages/room.module.css";
import ConnectionDialog from "../../components/domain/connection-dialog";

function RoomPage() {
  const [isLoading, setIsLoading] = useState(true);

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
