import { useRoom } from "../../../contexts/room-context";
import PointButton from "../../ui/point-button";
import styles from "./styles.module.css";

const AVAILABLE_POINTS = [1, 2, 3, 5, 8, 13, 21, 0];

function PointsList() {
  const { selectPoint, room, me, showPointsCountdown } = useRoom();

  function renderContent() {
    if (!room?.showPoints || showPointsCountdown > 0) {
      return AVAILABLE_POINTS.map((point) => (
        <PointButton
          key={`point-${point}`}
          selected={me?.points === point}
          onClick={() => selectPoint(point)}
          disabled={showPointsCountdown > 0}
        >
          {point === 0 ? "?" : point}
        </PointButton>
      ));
    }

    const preAverage = room?.peoples.reduce(
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

    const average = (preAverage?.total / preAverage?.count).toFixed(1);

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
