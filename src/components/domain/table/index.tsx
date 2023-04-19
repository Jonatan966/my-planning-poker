import cloneDeep from "lodash/cloneDeep";
import { useMemo } from "react";
import useDimensions from "react-cool-dimensions";
import { useRoomStore, People } from "../../../stores/room-store";
import PointCard from "./point-card";

import styles from "./styles.module.css";
import { TableCenter } from "./table-center";
import { TableResponsiveConfigs, Dimensions } from "./types";

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
  const { room, peoples } = useRoomStore((state) => ({
    room: state.basicInfo,
    peoples: state.peoples,
  }));

  const myID = room?.subscription?.members?.myID;

  const { observe, currentBreakpoint } = useDimensions({
    breakpoints: { XS: 0, SM: 500 },
    updateOnBreakpointChange: true,
  });

  if (!room) {
    return <></>;
  }

  const tableConfig =
    tableResponsiveConfigs?.[currentBreakpoint as Dimensions] ||
    tableResponsiveConfigs.default;

  const renderedTableModules = useMemo(() => {
    if (!currentBreakpoint) {
      return [];
    }

    const tableModules = buildTableModules(
      Object.values(peoples),
      tableConfig.limits
    );

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

  return (
    <div className={styles.table} ref={observe}>
      {renderedTableModules}

      <TableCenter {...{ tableConfig }} />
    </div>
  );
}

export default Table;
