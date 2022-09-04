import { useState } from "react";
import { useRoom } from "../../../contexts/room-context";
import { People } from "../../../contexts/room-context/types";
import Button from "../../ui/button";
import PointCard from "./point-card";

import styles from "./styles.module.css";

const tableModuleNames = ["bottom", "top", "left", "right"];

function buildTableModules(peoples: People[] = []) {
  const tableModules = [[], [], [], []] as People[][];
  let currentModule = 0;

  for (const people of peoples) {
    tableModules[currentModule].push(people);

    if (tableModules[currentModule].length % 3 === 0) {
      currentModule++;
    }

    if (currentModule > 3) {
      currentModule = 0;
    }
  }

  return tableModules;
}

function Table() {
  const { room, showPointsCountdown, me, setRoomPointsVisibility } = useRoom();
  const [isChangingPointsVisibility, setIsChangingPointsVisibility] =
    useState(false);

  if (!room) {
    return <></>;
  }

  const isSomePeopleSelectPoint = room.peoples.some(
    (people) => typeof people.points !== "undefined"
  );

  async function handleSetRoomPointsVisibility() {
    setIsChangingPointsVisibility(true);

    await setRoomPointsVisibility(!room.showPoints);

    setIsChangingPointsVisibility(false);
  }

  const tableModules = buildTableModules(room.peoples);

  const renderedTableModules = tableModules
    .map((roomPeoples, moduleIndex) => (
      <div
        className={styles[`${tableModuleNames[moduleIndex]}TableModule`]}
        key={`module-${moduleIndex}`}
      >
        {roomPeoples.map((roomPeople) => (
          <PointCard
            points={roomPeople.points}
            key={roomPeople.id}
            showPoints={room.showPoints && showPointsCountdown === 0}
            highlight={roomPeople.id === me?.id}
          >
            {roomPeople.name}
          </PointCard>
        ))}
      </div>
    ))
    .flat();

  return (
    <div className={styles.table}>
      {renderedTableModules}

      <div className={styles.tableCenter}>
        {room?.showPoints && showPointsCountdown > 0 ? (
          <h1>{showPointsCountdown}</h1>
        ) : (
          <Button
            colorScheme="secondary"
            onClick={handleSetRoomPointsVisibility}
            disabled={isChangingPointsVisibility || !isSomePeopleSelectPoint}
          >
            {room?.showPoints ? "NOVA PARTIDA" : "REVELAR CARTAS"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default Table;
