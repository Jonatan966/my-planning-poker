import { useParams } from "react-router-dom";
import Button from "../../components/button";
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
            <div className={styles.tableCard}>
              <button className={styles.pointCard}>2</button>
              <label>John Doe</label>
            </div>
          </div>
          <div className={styles.topTableModule}>
            <div className={styles.tableCard}>
              <button className={styles.pointCard}>2</button>
              <label>John Doe</label>
            </div>
            <div className={styles.tableCard}>
              <button className={styles.pointCard}>2</button>
              <label>John Doe</label>
            </div>
            <div className={styles.tableCard}>
              <button className={styles.pointCard}>2</button>
              <label>John Doe</label>
            </div>
          </div>
          <div className={styles.rightTableModule}>
            <div className={styles.tableCard}>
              <button className={styles.pointCard}>2</button>
              <label>John Doe</label>
            </div>
          </div>
          <div className={styles.bottomTableModule}>
            <div className={styles.tableCard}>
              <button className={styles.pointCard}>2</button>
              <label>John Doe</label>
            </div>
            <div className={styles.tableCard}>
              <button className={styles.pointCard}>2</button>
              <label>John Doe</label>
            </div>
            <div className={styles.tableCard}>
              <button className={styles.pointCard}>2</button>
              <label>John Doe</label>
            </div>
          </div>

          <div className={styles.tableCenter}>
            <Button colorScheme="danger">Começar nova votação</Button>
          </div>
        </div>
      </main>

      <footer className={styles.footerContainer}>
        <div className={styles.average}>
          <span>Média</span>
          <strong>2</strong>
        </div>

        <button className={`${styles.selectedPoint} ${styles.pointCard}`}>
          1
        </button>
        <button className={styles.pointCard}>2</button>
        <button className={styles.pointCard}>3</button>
        <button className={styles.pointCard}>5</button>
        <button className={styles.pointCard}>8</button>
        <button className={styles.pointCard}>13</button>
        <button className={styles.pointCard}>21</button>
        <button className={styles.pointCard}>?</button>
      </footer>
    </>
  );
}

export default RoomPage;
