// import cloneDeep from "lodash.clonedeep";
import Button from "../../ui/button";
import PointCard from "./point-card";

import styles from "./styles.module.css";

const tableModuleNames = ["left", "right", "bottom", "top"];

// const TABLE_MODULE_LIMITS = [1, 1, 4, 4];

function Table() {
  const fakePeople = {
    id: "abc",
    mode: "ready" as "ready",
    name: "teste",
    isHost: true,
    points: 1,
    isMe: true,
  };
  const tableModules = [[fakePeople], [], [], []];

  const renderedTableModules = tableModules
    .map((roomPeoples, moduleIndex) => (
      <div
        className={styles[`${tableModuleNames[moduleIndex]}TableModule`]}
        key={`module-${moduleIndex}`}
      >
        {roomPeoples.map((roomPeople) => (
          <PointCard
            people={fakePeople}
            mode={roomPeople.mode}
            points={roomPeople.points}
            key={roomPeople.id}
          />
        ))}
      </div>
    ))
    .flat();

  return (
    <div className={styles.table}>
      {renderedTableModules}

      <div className={styles.tableCenter}>
        <Button colorScheme="secondary">Nova Partida</Button>
      </div>
    </div>
  );
}

export default Table;
