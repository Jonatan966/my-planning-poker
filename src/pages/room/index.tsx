import { useParams } from "react-router-dom";
import Button from "../../components/button";
import PointsList from "../../components/domain/points-list";
import PointCard from "../../components/point-card";
import RoomHeader from "../../components/room-header";
import { useRoom } from "../../contexts/room-context";
import styles from "./styles.module.css";

function RoomPage() {
  const { room_id } = useParams();
  const { activeRoom, people, toggleRoomMode } = useRoom();

  return (
    <>
      <RoomHeader
        code={activeRoom?.id}
        name={activeRoom?.name}
        people={people}
      />
      <main className={styles.mainConatainer}>
        <div className={styles.table}>
          <div className={styles.leftTableModule}>
            <PointCard
              people={{ name: "Josep", isHost: true }}
              mode="ready"
              points={0}
            />
          </div>
          <div className={styles.topTableModule}>
            {activeRoom?.peoples.map((people) => (
              <PointCard
                people={{ name: people.name, isHost: people.isHost }}
                mode={people.mode}
                points={people.points}
                key={people.id}
              />
            ))}
          </div>
          <div className={styles.rightTableModule}>
            <PointCard people={{ name: "Josep" }} mode="ready" points={0} />
          </div>
          <div className={styles.bottomTableModule}>
            <PointCard people={{ name: "Josep" }} mode="ready" points={0} />
            <PointCard people={{ name: "Josep" }} mode="ready" points={0} />
            <PointCard people={{ name: "Josep" }} mode="ready" points={0} />
          </div>

          <div className={styles.tableCenter}>
            <Button colorScheme="secondary" onClick={() => toggleRoomMode()}>
              {activeRoom?.mode === "count_average"
                ? "Nova partida"
                : "Revelar cartas"}
            </Button>
          </div>
        </div>
      </main>

      <PointsList />
    </>
  );
}

export default RoomPage;
