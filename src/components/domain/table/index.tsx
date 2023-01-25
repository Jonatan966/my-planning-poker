import cloneDeep from "lodash/cloneDeep";
import { useEffect, useMemo, useState } from "react";
import useDimensions from "react-cool-dimensions";
import { useRoomStore, People } from "../../../stores/room-store";
import Button from "../../ui/button";
import PointCard from "./point-card";

import styles from "./styles.module.css";

type Dimensions = "XS" | "default";

type TableResponsiveConfigs = Record<
  Dimensions,
  {
    limits: number[];
    newMatchButton: string;
    revealCardsButton: string;
  }
>;

const ONE_SECOND = 1000;

const tableModuleNames = ["bottom", "top", "left", "right"];

const tableResponsiveConfigs: TableResponsiveConfigs = {
  XS: {
    limits: [2, 2, -1, -1],
    newMatchButton: "RESETAR",
    revealCardsButton: "REVELAR",
  },
  default: {
    limits: [-1, -1, -1, -1],
    newMatchButton: "NOVA PARTIDA",
    revealCardsButton: "REVELAR CARTAS",
  },
};

function isReachedTheLimit(
  limits: number[],
  modules: People[][],
  currentModule: number
) {
  const hasLimit = limits?.[currentModule] > -1;

  return hasLimit && modules[currentModule].length >= limits?.[currentModule];
}

function buildTableModules(
  peoples: People[] = [],
  limits = tableResponsiveConfigs.default.limits
) {
  const tableModules = [[], [], [], []] as People[][];
  let currentModule = 0;

  const peoplesQueue = cloneDeep(peoples);

  while (peoplesQueue.length) {
    if (!isReachedTheLimit(limits, tableModules, currentModule)) {
      tableModules[currentModule].push(peoplesQueue.shift());
    }

    if (
      isReachedTheLimit(limits, tableModules, currentModule) ||
      tableModules[currentModule].length % 3 === 0
    ) {
      currentModule++;
    }

    if (currentModule > 3) {
      currentModule = 0;
    }
  }

  return tableModules;
}

function Table() {
  const { room, peoples, setRoomPointsVisibility } = useRoomStore((state) => ({
    room: state.basicInfo,
    peoples: state.peoples,
    setRoomPointsVisibility: state.setRoomPointsVisibility,
  }));

  const { observe, currentBreakpoint } = useDimensions({
    breakpoints: { XS: 0, SM: 500 },
    updateOnBreakpointChange: true,
  });

  const [isTableButtonEnabled, setIsTableButtonEnabled] = useState(true);

  if (!room) {
    return <></>;
  }

  const myID = room?.subscription?.members?.myID;

  const tableConfig =
    tableResponsiveConfigs?.[currentBreakpoint as Dimensions] ||
    tableResponsiveConfigs.default;

  const countOfPeoplesWithPoints = peoples.filter(
    (people) => typeof people.points !== "undefined"
  ).length;

  const hasPeoplesWithPoints = countOfPeoplesWithPoints > 0;

  const isSafeToShowPoints =
    room.showPoints ||
    countOfPeoplesWithPoints >= Math.floor(peoples.length / 2);

  const tableButtonColorScheme = isSafeToShowPoints ? "secondary" : "danger";

  function debounceEnableTableButton() {
    setIsTableButtonEnabled(false);

    setTimeout(() => setIsTableButtonEnabled(true), ONE_SECOND);
  }

  async function handleSetRoomPointsVisibility() {
    const isRoomPointsVisible = !room.showPoints;

    if (isRoomPointsVisible) {
      setIsTableButtonEnabled(false);
    }

    await setRoomPointsVisibility(isRoomPointsVisible);
  }

  const renderedTableModules = useMemo(() => {
    if (!currentBreakpoint) {
      return [];
    }

    const tableModules = buildTableModules(peoples, tableConfig.limits);

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
              showPoints={room.showPoints && room.showPointsCountdown === 0}
              isMe={roomPeople.id === myID}
              highlight={roomPeople.highlight}
            >
              {roomPeople.name}
            </PointCard>
          ))}
        </div>
      ))
      .flat();

    return renderedTableModules;
  }, [peoples, room.showPointsCountdown, currentBreakpoint]);

  useEffect(() => {
    if (!room.showPoints || room.showPointsCountdown > 0) {
      return;
    }

    debounceEnableTableButton();
  }, [room.showPointsCountdown, room.showPoints]);

  return (
    <div className={styles.table} ref={observe}>
      {renderedTableModules}

      <div className={styles.tableCenter}>
        {room?.showPoints && room.showPointsCountdown > 0 ? (
          <h1>{room.showPointsCountdown}</h1>
        ) : (
          <Button
            colorScheme={tableButtonColorScheme}
            onClick={handleSetRoomPointsVisibility}
            disabled={
              !isTableButtonEnabled ||
              (!room.showPoints && !hasPeoplesWithPoints)
            }
            title={
              isSafeToShowPoints
                ? ""
                : "Ainda há pessoas que não selecionaram pontos"
            }
          >
            {
              tableConfig[
                room?.showPoints ? "newMatchButton" : "revealCardsButton"
              ]
            }
          </Button>
        )}
      </div>
    </div>
  );
}

export default Table;
