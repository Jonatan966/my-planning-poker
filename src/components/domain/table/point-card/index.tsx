import classNames from "classnames";
import { ReactNode } from "react";
import { BsFillSuitClubFill } from "react-icons/bs";

import styles from "./styles.module.css";

interface PointCardProps {
  points?: number;
  showPoints?: boolean;
  highlight?: boolean;
  children?: ReactNode;
}

function PointCard({
  highlight,
  points,
  showPoints,
  children,
}: PointCardProps) {
  const hasSelectedPoints = typeof points !== "undefined";
  const parsedPoints =
    typeof points !== "undefined" && points === 0 ? "?" : points;

  return (
    <div className={styles.pointCardContainer}>
      <div
        className={classNames(styles.point, {
          [styles.showPoints]: showPoints,
        })}
      >
        {showPoints
          ? parsedPoints
          : hasSelectedPoints && <BsFillSuitClubFill />}
      </div>
      <label
        className={classNames({
          [styles.isMe]: highlight,
        })}
      >
        {children}
      </label>
    </div>
  );
}

export default PointCard;
