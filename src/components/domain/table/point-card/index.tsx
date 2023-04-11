import classNames from "classnames";
import { ReactNode } from "react";
import { BsFillSuitClubFill, BsPiggyBankFill } from "react-icons/bs";

import styles from "./styles.module.css";
import { useRoomStore } from "../../../../stores/room-store";

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

  function Point() {
    const hasSelectedPoints = typeof points !== "undefined";
    const parsedPoints =
      typeof points !== "undefined" && points === 0 ? "?" : points;

    if (showPoints) {
      return <>{parsedPoints}</>;
    }

    if (hasSelectedPoints) {
      return showEasterEgg ? <BsPiggyBankFill /> : <BsFillSuitClubFill />;
    }

    return <></>;
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
        <Point />
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
