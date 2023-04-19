import { TableResponsiveConfigs } from "./types";

export const TABLE_RESPONSIVE_CONFIGS: TableResponsiveConfigs = {
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
