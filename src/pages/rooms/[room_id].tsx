import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import PointsList from "../../components/domain/points-list";
import RoomHeader from "../../components/domain/room-header";
import Table from "../../components/domain/table";

import styles from "../../styles/pages/room.module.css";

function RoomPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <RoomHeader />

      <main className={styles.mainConatainer}>
        <Table />
      </main>

      <PointsList />
    </>
  );
}

export default RoomPage;
