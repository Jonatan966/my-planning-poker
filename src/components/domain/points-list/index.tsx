import { useRoom } from "../../../contexts/room-context";
import PointButton from "../../ui/point-button";
import styles from "./styles.module.css";

const AVAILABLE_POINTS = [1, 2, 3, 5, 8, 13, 21, 0];

function PointsList() {
  const { selectPoint, people, activeRoom } = useRoom();

  function renderContent() {
    if (!activeRoom) {
      return null;
    }

    if (activeRoom.mode === "scoring") {
      return AVAILABLE_POINTS.map((point) => (
        <PointButton
          key={`point-${point}`}
          onClick={() => selectPoint(point)}
          selected={people?.points === point}
        >
          {point === 0 ? "?" : point}
        </PointButton>
      ));
    }

    const preAverage = activeRoom.peoples.reduce(
      (acc, people) => {
        if (typeof people.points === "undefined" || people.points === 0) {
          return acc;
        }

        acc.count++;
        acc.total += people.points;

        return acc;
      },
      { total: 0, count: 0 }
    );

    const average = (preAverage.total / preAverage.count).toFixed(1);

    return (
      <div className={styles.average}>
        <span>Média</span>
        <strong>{average === "NaN" ? 0 : average}</strong>
      </div>
    );
  }

  return (
    <footer className={styles.pointsListContainer}>{renderContent()}</footer>
  );
}

export default PointsList;
