import { cloneDeep } from "lodash";
import { People } from "../../../../stores/room-store";
import { TABLE_RESPONSIVE_CONFIGS } from "../constants";

export function separatePeoplesInModules(
  peoples: People[] = [],
  limits = TABLE_RESPONSIVE_CONFIGS.default.limits
) {
  const tableModules = [[], [], [], []] as People[][];
  let currentModule = 0;

  const peoplesQueue = cloneDeep(peoples);

  while (peoplesQueue.length) {
    if (!_isReachedTheLimit(limits, tableModules, currentModule)) {
      tableModules[currentModule].push(peoplesQueue.shift());
    }

    if (
      _isReachedTheLimit(limits, tableModules, currentModule) ||
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

function _isReachedTheLimit(
  limits: number[],
  modules: People[][],
  currentModule: number
) {
  const hasLimit = limits?.[currentModule] > -1;

  return hasLimit && modules[currentModule].length >= limits?.[currentModule];
}
