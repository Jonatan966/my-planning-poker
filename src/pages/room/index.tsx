import { useParams } from "react-router-dom";

import PointsList from "../../components/domain/points-list";
import RoomHeader from "../../components/domain/room-header";
import { useRoom } from "../../contexts/room-context";
import styles from "./styles.module.css";
import Table from "../../components/domain/table";

function RoomPage() {
  const { room_id } = useParams();
  const { activeRoom, people } = useRoom();

  return (
    <>
      <RoomHeader
        code={activeRoom?.id}
        name={activeRoom?.name}
        people={people}
      />
      <main className={styles.mainConatainer}>
        <Table />
      </main>

      <PointsList />
    </>
  );
}

export default RoomPage;
