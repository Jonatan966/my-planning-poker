import classNames from "classnames";
import { FaDice, FaStar } from "react-icons/fa";

import styles from "./styles.module.css";

export type PointCardModes = "unready" | "ready" | "show-points";

interface PointCardProps {
  points?: number;
  mode?: PointCardModes;
  people: {
    name: string;
    isHost?: boolean;
  };
}

function parseMode(mode: PointCardModes, points?: number | string) {
  switch (mode) {
    case "ready":
      return <FaDice />;
    case "show-points":
      return points;
  }
}

function PointCard({ people, points, mode = "unready" }: PointCardProps) {
  const parsedPoints =
    typeof points !== "undefined" && points === 0 ? "?" : points;

  return (
    <div className={styles.pointCardContainer}>
      <div
        className={classNames(styles.point, {
          [styles.showPoints]: mode === "show-points",
        })}
      >
        {parseMode(mode, parsedPoints)}
      </div>
      <label>
        {people.isHost && <FaStar />} {people.name}
      </label>
    </div>
  );
}

export default PointCard;
