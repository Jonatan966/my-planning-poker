import { useParams } from "react-router-dom";

import PointsList from "../../components/domain/points-list";
import RoomHeader from "../../components/domain/room-header";
import styles from "./styles.module.css";
import Table from "../../components/domain/table";

function RoomPage() {
  const { room_id } = useParams();

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
