import { useEffect, useMemo, useState } from "react";
import { useRoomStore } from "../../../../stores/room-store";
import Button from "../../../ui/button";
import { AfkButton } from "../afk-button";
import { TableResponsiveConfig } from "../types";

import styles from "./styles.module.css";

interface TableCenterProps {
  tableConfig: TableResponsiveConfig;
}

const ONE_SECOND = 1000;

export function TableCenter({ tableConfig }: TableCenterProps) {
  const { room, peoples, myID, hasPeopleWithPoints, setRoomPointsVisibility } =
    useRoomStore((state) => ({
      room: state.basicInfo,
      peoples: state.peoples,
      myID: room?.subscription?.members?.myID,
      hasPeopleWithPoints: state.hasPeopleWithPoints,
      setRoomPointsVisibility: state.setRoomPointsVisibility,
    }));

  const [isTableButtonTemporaryDisabled, setIsTableButtonTemporaryDisabled] =
    useState(false);

  const isInCountdown = room?.showPoints && room.showPointsCountdown > 0;

  const {
    countOfPeoplesWithPoints,
    meSelectedPoints,
    isHaveMinimalPeoplesWithPoints,
  } = useMemo(() => {
    let countOfPeoplesWithPoints = 0;

    for (const peopleID in peoples) {
      const { points } = peoples[peopleID];

      if (typeof points !== "undefined") {
        countOfPeoplesWithPoints++;
      }
    }

    const meSelectedPoints = typeof peoples[myID]?.points !== "undefined";

    const halfPeoplesCount = Math.floor(Object.keys(peoples).length / 2);
    const isHaveMinimalPeoplesWithPoints =
      countOfPeoplesWithPoints >= halfPeoplesCount;

    return {
      countOfPeoplesWithPoints,
      meSelectedPoints,
      isHaveMinimalPeoplesWithPoints,
    };
  }, [peoples, room?.subscription]);

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

  const isSafeToShowPoints = room.showPoints || isHaveMinimalPeoplesWithPoints;

  const tableButtonColorScheme = isSafeToShowPoints ? "secondary" : "danger";
  const tableButtonTitle = isSafeToShowPoints
    ? ""
    : "Ainda há pessoas que não selecionaram pontos";

  return (
    <div className={styles.tableCenter}>
      {isInCountdown ? (
        <h1>{room.showPointsCountdown}</h1>
      ) : (
        <>
          <Button
            colorScheme={tableButtonColorScheme}
            onClick={handleSetRoomPointsVisibility}
            disabled={isTableButtonDisabled}
            title={tableButtonTitle}
          >
            {actionButtonText}
          </Button>
          {!room?.showPoints && (
            <AfkButton {...{ countOfPeoplesWithPoints, meSelectedPoints }} />
          )}
        </>
      )}
    </div>
  );
}
