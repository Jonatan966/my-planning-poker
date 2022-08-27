import classNames from "classnames";
import confetti from "canvas-confetti";
import ReactConfetti from "react-canvas-confetti";

import { People, useRoom } from "../../../contexts/room-context";
import PointButton from "../../ui/point-button";
import styles from "./styles.module.css";

const AVAILABLE_POINTS = [1, 2, 3, 5, 8, 13, 21, 0];
const CONFETTI_SETTINGS: confetti.Options = {
  startVelocity: 30,
  spread: 125,
  ticks: 60,
  zIndex: 0,
  particleCount: 100,
  origin: {
    x: 0.5,
    y: 1,
  },
};

function calculatePointsAverage(peoples: People[] = []) {
  const preAverage = peoples.reduce(
    (acc, people) => {
      if (acc.current === -1) {
        acc.current = people.points;
      }

      if (acc.current !== people.points) {
        acc.isUnanimous = false;
      }

      if (typeof people.points === "undefined" || people.points === 0) {
        return acc;
      }

      acc.count++;
      acc.total += people.points;

      return acc;
    },
    {
      total: 0,
      count: 0,
      current: -1,
      isUnanimous: true,
    }
  );

  const average =
    preAverage?.total > 0
      ? Number((preAverage?.total / preAverage?.count).toFixed(1))
      : "?";

  return {
    average,
    isUnanimous: preAverage.isUnanimous,
  };
}

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

    const { average, isUnanimous } = calculatePointsAverage(room?.peoples);

    return (
      <>
        <ReactConfetti
          refConfetti={(fireConfetti) => {
            if (isUnanimous && fireConfetti) {
              fireConfetti(CONFETTI_SETTINGS);
            }
          }}
          className={styles.confetti}
        />
        <div
          className={classNames(styles.average, {
            [styles.isUnanimous]: isUnanimous,
          })}
        >
          <span>{isUnanimous ? "Temos um acordo!" : "Média"}</span>
          <strong>{average}</strong>
        </div>
      </>
    );
  }

  return (
    <footer className={styles.pointsListContainer}>{renderContent()}</footer>
  );
}

export default PointsList;
