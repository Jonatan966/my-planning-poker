import cloneDeep from "lodash.clonedeep";
import { People, useRoom } from "../../../contexts/room-context";
import Button from "../../ui/button";
import PointCard from "./point-card";

import styles from "./styles.module.css";

const tableModuleNames = ["left", "right", "bottom", "top"];

const TABLE_MODULE_LIMITS = [1, 1, 4, 4];

function Table() {
  const { activeRoom, toggleRoomMode } = useRoom();

  if (!activeRoom) {
    return null;
  }

  const clonePeoples = cloneDeep(activeRoom.peoples);
  let currentTableModule = 0;
  let fullTableModuleCount = 0;

  const tableModules: People[][] = [[], [], [], []];

  while (clonePeoples.length) {
    if (fullTableModuleCount === 4) {
      break;
    }

    if (currentTableModule > tableModuleNames.length - 1) {
      currentTableModule = 0;
    }

    let hasFullTableModule =
      tableModules[currentTableModule].length ===
      TABLE_MODULE_LIMITS[currentTableModule];

    if (!hasFullTableModule) {
      const nextPeople = clonePeoples.shift();

      if (nextPeople) {
        tableModules[currentTableModule].push(nextPeople);
      }

      hasFullTableModule =
        tableModules[currentTableModule].length ===
        TABLE_MODULE_LIMITS[currentTableModule];
    }

    currentTableModule++;

    if (hasFullTableModule) {
      fullTableModuleCount++;
      continue;
    }
  }

  const renderedTableModules = tableModules
    .map((peoples, moduleIndex) => (
      <div
        className={styles[`${tableModuleNames[moduleIndex]}TableModule`]}
        key={`module-${moduleIndex}`}
      >
        {peoples.map((people) => (
          <PointCard
            people={{ name: people.name, isHost: people.isHost }}
            mode={people.mode}
            points={people.points}
            key={people.id}
          />
        ))}
      </div>
    ))
    .flat();

  return (
    <div className={styles.table}>
      {renderedTableModules}

      <div className={styles.tableCenter}>
        <Button colorScheme="secondary" onClick={() => toggleRoomMode()}>
          {activeRoom?.mode === "count_average"
            ? "Nova partida"
            : "Revelar cartas"}
        </Button>
      </div>
    </div>
  );
}

export default Table;
