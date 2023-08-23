import { useEffect, useState } from "react";
import { useRoomStore } from "../../../../stores/room-store";
import Button from "../../../ui/button";
import { AfkButton } from "../afk-button";
import { TableResponsiveConfig } from "../types";

import { FaSpinner } from "react-icons/fa";
import styles from "./styles.module.css";

interface TableCenterProps {
  tableConfig: TableResponsiveConfig;
}

const ONE_SECOND = 1000;

export function TableCenter({ tableConfig }: TableCenterProps) {
  const { room, hasPeopleWithPoints, setRoomPointsVisibility } = useRoomStore(
    (state) => ({
      room: state.basicInfo,
      hasPeopleWithPoints: state.hasPeopleWithPoints,
      setRoomPointsVisibility: state.setRoomPointsVisibility,
    })
  );

  const [isTableButtonTemporaryDisabled, setIsTableButtonTemporaryDisabled] =
    useState(false);

  const isInCountdown = room?.showPoints && room.showPointsCountdown > 0;

  async function handleSetRoomPointsVisibility() {
    const isRoomPointsVisible = !room.showPoints;

    if (isRoomPointsVisible) {
      setIsTableButtonTemporaryDisabled(true);
    }

    await setRoomPointsVisibility(isRoomPointsVisible);
  }

  function debounceEnableTableButton() {
    setIsTableButtonTemporaryDisabled(true);

    setTimeout(() => setIsTableButtonTemporaryDisabled(false), ONE_SECOND);
  }

  useEffect(() => {
    if (!room.showPoints || room.showPointsCountdown > 0) {
      return;
    }

    debounceEnableTableButton();
  }, [room.showPointsCountdown, room.showPoints]);

  const actionButtonText = room?.showPoints
    ? tableConfig.newMatchButton
    : tableConfig.revealCardsButton;

  const isTableButtonDisabled =
    isTableButtonTemporaryDisabled ||
    (!room.showPoints && !hasPeopleWithPoints);

  return (
    <div className={styles.tableCenter}>
      {isInCountdown ? (
        <h1>{room.showPointsCountdown}</h1>
      ) : room?.inPreInitCooldown ? (
        <FaSpinner className={styles.spinner} size={24} />
      ) : (
        <>
          <Button
            colorScheme="secondary"
            onClick={handleSetRoomPointsVisibility}
            disabled={isTableButtonDisabled}
          >
            {actionButtonText}
          </Button>
          {!room?.showPoints && <AfkButton />}
        </>
      )}
    </div>
  );
}
