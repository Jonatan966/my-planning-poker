import classNames from "classnames";
import { ReactNode } from "react";
import { BsFillSuitClubFill, BsPiggyBankFill } from "react-icons/bs";
import { useRoomStore } from "../../../../stores/room-store";

import styles from "./styles.module.css";

interface PointCardProps {
  points?: number;
  showPoints?: boolean;
  isMe?: boolean;
  highlight?: boolean;
  children?: ReactNode;
}

function PointCard({
  isMe,
  points,
  showPoints,
  highlight,
  children,
}: PointCardProps) {
  const { showEasterEgg } = useRoomStore((state) => ({
    showEasterEgg: state.showEasterEgg,
  }));

  const hasSelectedPoints = typeof points !== "undefined";
  const parsedPoints =
    typeof points !== "undefined" && points === 0 ? "?" : points;

  function decideIconToShow() {
    if (showEasterEgg) {
      return <BsPiggyBankFill />;
    }

    return <BsFillSuitClubFill />;
  }

  return (
    <div
      className={styles.pointCardContainer}
      title={highlight ? "Confetes!!" : ""}
    >
      <div
        className={classNames(styles.point, {
          [styles.showPoints]: showPoints,
          [styles.highlight]: highlight,
        })}
      >
        {showPoints ? parsedPoints : hasSelectedPoints && decideIconToShow()}
      </div>
      <label
        className={classNames({
          [styles.isMe]: isMe,
        })}
      >
        {children}
      </label>
    </div>
  );
}

export default PointCard;
