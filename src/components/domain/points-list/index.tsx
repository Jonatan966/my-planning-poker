import { useMemo, useRef } from "react";
import classNames from "classnames";

import PointButton from "../../ui/point-button";
import { useRoomStore, People } from "../../../stores/room-store";
import { useConfetti } from "../../../contexts/confetti-context";

import styles from "./styles.module.css";

const AVAILABLE_POINTS = [1, 2, 3, 5, 8, 13, 21, 0];

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
  const { room, peoples, selectPoint } = useRoomStore((state) => ({
    selectPoint: state.selectPoint,
    room: state.basicInfo,
    peoples: state.peoples,
  }));

  const { fireFocusedConfetti } = useConfetti();
  const hasFiredConfetti = useRef(false);

  const me = useMemo(() => {
    if (!room || !room.subscription?.members) {
      return;
    }

    return peoples.find(
      (people) => people.id === room.subscription.members.myID
    );
  }, [peoples, room]);

  function fireUnanimousConfetti() {
    if (hasFiredConfetti.current) {
      return;
    }

    fireFocusedConfetti();
    hasFiredConfetti.current = true;
  }

  function renderContent() {
    if (!room?.showPoints || room.showPointsCountdown > 0) {
      hasFiredConfetti.current = false;

      return AVAILABLE_POINTS.map((point) => (
        <PointButton
          key={`point-${point}`}
          selected={me?.points === point}
          onClick={() => selectPoint(point)}
          disabled={room.showPointsCountdown > 0}
        >
          {point === 0 ? "?" : point}
        </PointButton>
      ));
    }

    const { average, isUnanimous } = calculatePointsAverage(peoples);

    if (isUnanimous) {
      fireUnanimousConfetti();
    }

    return (
      <div
        className={classNames(styles.average, {
          [styles.isUnanimous]: isUnanimous,
        })}
      >
        <span>{isUnanimous ? "Temos um acordo!" : "Média"}</span>
        <strong>{average}</strong>
      </div>
    );
  }

  return (
    <footer className={styles.pointsListContainer}>{renderContent()}</footer>
  );
}

export default PointsList;
