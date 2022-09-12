import classNames from "classnames";
import { ReactNode } from "react";
import { BsFillSuitClubFill, BsPiggyBankFill } from "react-icons/bs";
import { useEasterEggStore } from "../../../../stores/easter-egg-store";

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
  const { easterEggCountdown } = useEasterEggStore();
  const hasSelectedPoints = typeof points !== "undefined";
  const parsedPoints =
    typeof points !== "undefined" && points === 0 ? "?" : points;

  function decideIconToShow() {
    if (easterEggCountdown <= 0) {
      return <BsPiggyBankFill />;
    }

    return <BsFillSuitClubFill />;
  }

  return (
    <div className={styles.pointCardContainer}>
      <div
        className={classNames(styles.point, {
          [styles.showPoints]: showPoints,
        })}
      >
        {showPoints ? parsedPoints : hasSelectedPoints && decideIconToShow()}
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
