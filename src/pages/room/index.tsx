import { useParams } from "react-router-dom";
import Button from "../../components/button";
import PointButton from "../../components/point-button";
import PointCard from "../../components/point-card";
import RoomHeader from "../../components/room-header";
import styles from "./styles.module.css";

function RoomPage() {
  const { room_id } = useParams();

  return (
    <>
      <RoomHeader />

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
            <PointCard people={{ name: "Josep" }} mode="ready" points={0} />
            <PointCard people={{ name: "Josep" }} mode="ready" points={0} />
            <PointCard people={{ name: "Josep" }} mode="ready" points={0} />
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
            <Button colorScheme="secondary">Começar nova votação</Button>
          </div>
        </div>
      </main>

      <footer className={styles.footerContainer}>
        <div className={styles.average}>
          <span>Média</span>
          <strong>2</strong>
        </div>

        <PointButton>1</PointButton>
        <PointButton>2</PointButton>
        <PointButton>3</PointButton>
        <PointButton selected>5</PointButton>
        <PointButton>8</PointButton>
        <PointButton>13</PointButton>
        <PointButton>21</PointButton>
        <PointButton>?</PointButton>
      </footer>
    </>
  );
}

export default RoomPage;
