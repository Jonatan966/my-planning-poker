import { useMemo } from "react";
import useDimensions from "react-cool-dimensions";
import { useRoomStore } from "../../../stores/room-store";

import { TableCenter } from "./table-center";
import { Dimensions, TableModulePosition } from "./types";
import { TableModule } from "./table-module";

import { TABLE_RESPONSIVE_CONFIGS } from "./constants";
import { separatePeoplesInModules } from "./utils/separate-peoples-in-modules";

import styles from "./styles.module.css";

function Table() {
  const { room, peoples } = useRoomStore((state) => ({
    room: state.basicInfo,
    peoples: state.peoples,
  }));

  const { observe, currentBreakpoint } = useDimensions({
    breakpoints: { XS: 0, SM: 500 },
    updateOnBreakpointChange: true,
  });

  const tableConfig =
    TABLE_RESPONSIVE_CONFIGS?.[currentBreakpoint as Dimensions] ||
    TABLE_RESPONSIVE_CONFIGS.default;

  const [bottomModule, topModule, leftModule, rightModule] = useMemo(() => {
    if (!currentBreakpoint) {
      return [];
    }

    const tableModules = separatePeoplesInModules(
      Object.values(peoples),
      tableConfig.limits
    );

    return tableModules;
  }, [peoples, room.showPointsCountdown, currentBreakpoint]);

  if (!room) {
    return <></>;
  }

  return (
    <div className={styles.table} ref={observe}>
      <TableModule
        position={TableModulePosition.BOTTOM}
        peoples={bottomModule}
      />
      <TableModule position={TableModulePosition.TOP} peoples={topModule} />
      <TableModule position={TableModulePosition.LEFT} peoples={leftModule} />
      <TableModule position={TableModulePosition.RIGHT} peoples={rightModule} />

      <TableCenter {...{ tableConfig }} />
    </div>
  );
}

export default Table;
